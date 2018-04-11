import '@toba/test';
import './client.test';
import { Flickr } from '@toba/flickr';
import { loadCategory } from './category';
import { flickr } from './client';

let res: Flickr.Collection[];

beforeAll(async () => {
   res = await flickr.client.getCollections();
   expect(res).toBeDefined();
});

test('Creates category', () => {
   const c = loadCategory(res[0]);
   expect(c).toBeDefined();
   expect(c.title).toBe('When');
});

test('Assigns sub-categories', () => {
   const c = loadCategory(res[1]);
   expect(c.title).toBe('Where');
   expect(c.subcategories.size).toBe(31);
   expect(c.isParent).toBe(true);

   const subcat = c.getSubcategory('where/boise-ridge');
   expect(subcat).toBeDefined();
   expect(subcat.title).toBe('Boise Ridge');
   expect(subcat.isChild).toBe(true);
});

test('Assigns posts', () => {
   const c = loadCategory(res[2]);
   expect(c.title).toBe('Who');
   expect(c.subcategories.size).toBe(7);
   expect(c.posts.size).toBe(0);

   const subcat = c.getSubcategory('who/family');
   expect(subcat).toBeDefined();
   expect(subcat.title).toBe('Family');
   expect(subcat.posts.size).toBe(32);
});
