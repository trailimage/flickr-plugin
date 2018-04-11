import { Flickr, FeatureSet } from '@toba/flickr';
import { slug, is } from '@toba/tools';
import { Category, photoBlog, Post } from '@trailimage/models';
import { loadPost } from './post';
import { flickr } from './client';

/**
 * Create post category from Flickr data.
 *
 * @param root Whether it's a root category
 */
export function loadCategory(
   collection: Flickr.Collection,
   root = false
): Category {
   const category = new Category(slug(collection.title), collection.title);
   const feature: FeatureSet[] = flickr.config.featureSets;
   let exclude = flickr.config.excludeSets;
   let p: Post = null;

   if (exclude === undefined) {
      exclude = [];
   }
   if (root) {
      photoBlog.categories.set(category.title, category);
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
            category.posts.add(p);
            p.categories.set(category.key, category.title);

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
