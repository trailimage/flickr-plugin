import '@toba/test';
import { blog } from '@trailimage/models';
import { postCount } from './.test-data';
import { loadPhotoBlog } from './photo-blog';

beforeAll(async () => {
   expect(blog.loaded).toBe(false);
   await loadPhotoBlog(false);
   expect(blog.loaded).toBe(true);
   expect(blog.posts.length).toBe(postCount);
   console.log = jest.fn();
});

test('has root categories', () => {
   expect(blog.categories).toHaveKeys('what', 'when', 'where', 'who');
});

test('returns category for key', () => {
   const what = blog.categoryWithKey('what');
   expect(what).toBeDefined();
   expect(what.title).toBe('What');
   expect(what.isChild).toBe(false);
   expect(what.isParent).toBe(true);

   const bicycle = blog.categoryWithKey('what/bicycle');
   expect(bicycle).toBeDefined();
   expect(bicycle.title).toBe('Bicycle');
   expect(bicycle.isChild).toBe(true);
   expect(bicycle.isParent).toBe(false);
});

test('returns keys for category', () => {
   const all = blog.categoryKeys();
   const two = blog.categoryKeys('When', 'Bicycle');

   expect(all.length).toBe(62);
   expect(all).toContain('what/jeep-wrangler');

   expect(two.length).toBe(2);
   expect(two).toContain('what/bicycle');
});

test('includes all photo tags with their full names', () => {
   expect(blog.tags).toHaveKeys(
      'algae',
      'andersonranchreservoir',
      'dam',
      'horse',
      'jason'
   );
   expect(blog.tags.get('andersonranchreservoir')).toBe(
      'Anderson Ranch Reservoir'
   );
});

test('has post summaries', () => {
   expect(blog.posts).toHaveLength(postCount);
});

test('finds posts by ID or key', () => {
   const post1 = blog.postWithID('72157666685116730');

   expect(post1).toBeDefined();
   expect(post1.title).toBe('Spring Fish & Chips');
   expect(post1.photoCount).toBe(32);

   const post2 = blog.postWithKey('owyhee-snow-and-sand/lowlands');

   expect(post2).toBeDefined();
   expect(post2.title).toBe('Owyhee Snow and Sand');
   expect(post2.subTitle).toBe('Lowlands');
   // expect(post2.description).toBe(
   //    'I have had my fill of the place but I think Brenna might find Kuna Cave a fun adventure so her and Hunter join me in the little car for the short drive to dusty spelunking while Jessica is busy with meetings.'
   // );
});

test('creates list of post keys', () => {
   const keys = blog.postKeys();
   expect(keys).toHaveLength(postCount);
   expect(keys).toContain('brother-ride-2015/simmons-creek');
});

test('removes posts', () => {
   let post = blog.postWithKey('owyhee-snow-and-sand/lowlands');
   expect(post).toBeDefined();
   blog.remove(post.key);
   post = blog.postWithKey('owyhee-snow-and-sand/lowlands');
   expect(post).not.toBeDefined();
});

test('finds post having a photo', async () => {
   const post = await blog.postWithPhoto('8459503474');
   expect(post).toBeDefined();
   expect(post).toHaveProperty('id', '72157632729508554');
});

test('finds photos with tags', async () => {
   const photos = await blog.getPhotosWithTags('horse');
   expect(photos).toBeDefined();
   expect(photos).toBeInstanceOf(Array);
   expect(photos.length).toBe(19);
   expect(photos[0]).toHaveAllProperties('id', 'size');
});

test('correlates posts in series', async () => {
   const post = await blog.postWithKey('brother-ride-2015/huckleberry-lookout');
   expect(post).toBeDefined();
   expect(post).toHaveProperty('isPartial', true);
});

test('can be emptied', () => {
   blog.empty();
   expect(blog.loaded).toBe(false);
   expect(blog.posts).toEqual([]);
});

test('reloads blog and identifies changed cache keys', async () => {
   const postKeys = [
      'owyhee-snow-and-sand/lowlands',
      'kuna-cave-fails-to-impress'
   ];
   await loadPhotoBlog(false);
   blog.remove(...postKeys);
   await loadPhotoBlog(false);

   const changes = blog.changedKeys;

   // changes should include the posts and their categories
   expect(changes).toBeInstanceOf(Array);
   // post was first in series so key is series slug only
   expect(changes).toContain('owyhee-snow-and-sand');
   expect(changes).toContain(postKeys[1]);
   expect(changes).toContain('who/solo');
   expect(changes).toContain('where/owyhees');
   expect(changes).toContain('where/kuna-cave');
});

// test('creates GeoJSON for posts', () =>
//    factory.map.track('owyhee-snow-and-sand/lowlands').then(item => {
//       expect(item).toBeDefined();
//       expect(is.cacheItem(item)).toBe(true);
//    }));
