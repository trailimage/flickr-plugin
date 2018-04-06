import { Flickr, FeatureSet } from '@toba/flickr';
import { slug, is } from '@toba/tools';
import { Category, photoBlog, Post, config } from '@trailimage/models';
import { load as loadPost } from './post';

/**
 * Create post category from Flickr data.
 */
export function loadCategory(collection: Flickr.Collection, root = false): Category {
   const category = new Category(slug(collection.title), collection.title);
   const feature: FeatureSet = config.flickr.featureSets;
   let exclude = config.flickr.excludeSets;
   let p: Post = null;

   if (exclude === undefined) {
      exclude = [];
   }
   if (root) {
      photoBlog.categories[category.title] = category;
   }

   if (is.array(collection.set) && collection.set.length > 0) {
      // category contains one or more posts
      for (const s of collection.set) {
         if (exclude.indexOf(s.id) == -1) {
            // see if post is already present in the library in another category
            p = photoBlog.postWithID(s.id);

            // create post if it isn't part of an already added category
            if (!is.value<Post>(p)) {
               p = loadPost(s);
            }

            // add post to category and category to post
            category.posts.push(p);
            p.categories[category.key] = category.title;

            // also add post to library (faster lookups)
            photoBlog.addPost(p);
         }
      }
   }

   if (is.array(collection.collection)) {
      // recursively add subcategories
      collection.collection.forEach(c => {
         category.add(loadCategory(c));
      });
   }

   if (root && is.array<FeatureSet>(feature)) {
      // sets to be featured at the collection root can be manually defined in
      // configuration
      for (const f of feature) {
         const p = loadPost(f, false);
         p.feature = true;
         photoBlog.addPost(p);
      }
   }
   return category;
}
