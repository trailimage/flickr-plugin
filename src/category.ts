import { Flickr } from '@toba/flickr';
import { is, slug } from '@toba/tools';
import { Category, Post, blog } from '@trailimage/models';
import { flickr } from './client';
import { loadPost } from './post';

/**
 * Create post category from Flickr data.
 *
 * @param root Whether it's a root category
 */
export function loadCategory(
   collection: Flickr.Collection,
   root = false
): Category {
   if (collection.title === undefined) {
      throw new ReferenceError('Flickr collection is missing a title');
   }
   const key = slug(collection.title);

   if (key === null) {
      throw new Error(
         `Unable to create slug from collection ${collection.title}`
      );
   }
   const category = new Category(key, collection.title);
   let exclude = flickr.config.excludeSets;
   let p: Post | undefined;

   if (exclude === undefined) {
      exclude = [];
   }
   if (root) {
      // add category to blog's root set
      blog.categories.set(slug(category.title)!, category);
   }

   if (is.array(collection.set) && collection.set.length > 0) {
      // category contains one or more posts
      for (const s of collection.set) {
         if (exclude.indexOf(s.id) == -1) {
            // see if post is already present in another category
            p = blog.postWithID(s.id);

            // create post if it isn't part of an already added category
            if (!is.value<Post>(p)) {
               p = loadPost(s);
            }

            // add post to category and category to post
            category.posts.add(p);
            p.categories.set(category.key, category.title);

            // also add post to blog (faster lookups)
            blog.addPost(p);
         }
      }
   }

   if (is.array(collection.collection)) {
      // recursively add subcategories
      collection.collection.forEach(c => {
         category.add(loadCategory(c));
      });
   }
   return category;
}
