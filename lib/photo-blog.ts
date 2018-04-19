import { Flickr } from '@toba/flickr';
import { log } from '@toba/logger';
import { is } from '@toba/tools';
import { PhotoBlog } from '@trailimage/models';
import { loadCategory } from './category';
import { flickr } from './client';

/**
 * Load blog categories, photo tags and post summaries from Flickr data.
 * @param async Whether to load set information asynchronously
 */
export async function loadPhotoBlog(
   photoBlog: PhotoBlog,
   async = true
): Promise<PhotoBlog> {
   // store existing post keys to compute changes
   const hadPostKeys = photoBlog.postKeys();
   // reset changed keys to none
   photoBlog.changedKeys = [];

   const [collections, tags] = await Promise.all([
      flickr.client.getCollections(),
      flickr.client.getAllPhotoTags()
   ]);

   // parse collections and photo tags
   photoBlog.tags = is.value<Flickr.Tag[]>(tags) ? parsePhotoTags(tags) : null;
   collections.forEach(c => loadCategory(c, true));
   photoBlog.correlatePosts();
   photoBlog.loaded = true;

   log.info(
      `Loaded ${
         photoBlog.posts.length
      } photo posts from Flickr: beginning detail retrieval`
   );

   // retrieve additional post info without waiting for it to finish
   const postInfo = Promise.all(photoBlog.posts.map(p => p.getInfo())).then(
      () => {
         photoBlog.postInfoLoaded = true;
         log.info('Finished loading post details');
      }
   );

   if (!async) {
      // if async is disabled then wait for post information to load
      await postInfo;
   }

   // find changed post and category keys so their caches can be invalidated
   if (hadPostKeys.length > 0) {
      let changedKeys: string[] = [];
      photoBlog.posts
         .filter(p => hadPostKeys.indexOf(p.key) == -1)
         .forEach(p => {
            log.info('Found new post "%s"', p.title);
            // all post categories will need to be refreshed
            changedKeys = changedKeys.concat(Array.from(p.categories.keys()));
            // update adjecent posts to correct next/previous links
            if (is.value(p.next)) {
               changedKeys.push(p.next.key);
            }
            if (is.value(p.previous)) {
               changedKeys.push(p.previous.key);
            }
         });
      photoBlog.changedKeys = changedKeys;
   }

   return photoBlog;
}

/**
 * Convert tags to hash of phrases keyed to their "clean" abbreviation
 */
function parsePhotoTags(rawTags: Flickr.Tag[]): Map<string, string> {
   const exclusions = is.array(flickr.config.excludeTags)
      ? flickr.config.excludeTags
      : [];
   return rawTags.reduce((tags, t) => {
      const text = t.raw[0]._content;
      // ensure not machine or exluded tag
      if (text.indexOf('=') == -1 && exclusions.indexOf(text) == -1) {
         tags.set(t.clean, text);
      }
      return tags;
   }, new Map<string, string>());
}
