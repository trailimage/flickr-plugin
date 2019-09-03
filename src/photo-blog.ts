import { Flickr } from '@toba/flickr';
import { is } from '@toba/tools';
import { PhotoBlog, Post, blog } from '@trailimage/models';
import { loadCategory } from './category';
import { flickr } from './client';
import { loadPost } from './post';
import { provider } from './provider';
import { FeatureSet } from './index';

/**
 * Load blog categories, photo tags and post summaries from Flickr data. Method
 * must be idempotent so it can be called repeatedly to load new data without
 * creating duplicates.
 *
 * @param async Whether to return blog instance without waiting for post
 * details to load
 */
export async function loadPhotoBlog(async = true): Promise<PhotoBlog> {
   let collections: Flickr.Collection[] | null = [];
   let tags: Flickr.Tag[] | null = [];

   try {
      [collections, tags] = await Promise.all([
         flickr.client.getCollections(),
         flickr.client.getAllPhotoTags()
      ]);
   } catch (err) {
      console.error(err);
      blog.loaded = false;
      return blog;
   }

   blog.beginLoad();
   // parse collections and photo tags
   blog.tags = is.value<Flickr.Tag[]>(tags) ? parsePhotoTags(tags) : new Map();

   if (collections !== null) {
      collections.forEach(c => loadCategory(c, true));
   }

   // posts are sorted newest first so add featured, non-chronological sets at
   // the end
   const features: FeatureSet[] | undefined = provider.config.featureSets;

   if (is.array<FeatureSet>(features)) {
      // sets to be featured at the collection root can be manually defined in
      // configuration
      for (const f of features) {
         let p: Post | undefined = blog.postWithID(f.id);

         if (p === undefined) {
            p = loadPost(f, false);
            p.feature = true;
            blog.addPost(p);
         }
      }
   }

   blog.finishLoad();

   console.info(
      `Loaded ${blog.posts.length} photo posts from Flickr: beginning detail retrieval`
   );

   // retrieve additional post info without waiting for it to finish
   const postInfo = Promise.all(blog.posts.map(p => p.getInfo())).then(() => {
      blog.postInfoLoaded = true;
      console.info('Finished loading post details');
   });

   if (!async) {
      // if async is disabled then wait for post information to load
      await postInfo;
   }

   return blog;
}

/**
 * Convert tags to hash of phrases keyed to their "clean" abbreviation.
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
