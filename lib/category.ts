import { Flickr } from '@toba/flickr';
import { is, slug } from '@toba/tools';
import { Category, Post, blog } from '@trailimage/models';
import { flickr } from './client';
import { loadPost } from './post';

/**
 * Create post category from Flickr data.
 *
 * @param posts Already loaded posts
 * @param root Whether it's a root category
 */
export function loadCategory(
   collection: Flickr.Collection,
   posts: Post[],
   root = false
): Category {
   const category = new Category(slug(collection.title), collection.title);
   let exclude = flickr.config.excludeSets;
   let p: Post = null;

   if (exclude === undefined) {
      exclude = [];
   }
   if (root) {
      blog.categories.set(slug(category.title), category);
   }

   if (is.array(collection.set) && collection.set.length > 0) {
      // category contains one or more posts
      for (const s of collection.set) {
         if (exclude.indexOf(s.id) == -1) {
            // see if post is already present in another category
            posts.find(p => p.id == s.id);

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
         category.add(loadCategory(c, posts));
      });
   }
   return category;
}
