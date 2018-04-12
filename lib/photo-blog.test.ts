import '@toba/test';
import { photoBlog } from '@trailimage/models';
import { flickr } from './client';
import { testConfig } from './config';
import { loadPhotoBlog } from './photo-blog';

beforeAll(async () => {
   flickr.configure(testConfig);
   expect(photoBlog.loaded).toBe(false);
   await loadPhotoBlog(photoBlog, false);
   expect(photoBlog.loaded).toBe(true);
});

test('Has root categories', () => {
   expect(photoBlog.categories).toHaveKeys('what', 'when', 'where', 'who');
});

test('Returns category for key', () => {
   const what = photoBlog.categoryWithKey('what');
   expect(what).toBeDefined();
   expect(what.title).toBe('What');
   expect(what.isChild).toBe(false);
   expect(what.isParent).toBe(true);

   const bicycle = photoBlog.categoryWithKey('what/bicycle');
   expect(bicycle).toBeDefined();
   expect(bicycle.title).toBe('Bicycle');
   expect(bicycle.isChild).toBe(true);
   expect(bicycle.isParent).toBe(false);
});

test('Returns keys for category', () => {
   const all = photoBlog.categoryKeys();
   const two = photoBlog.categoryKeys('when', 'bicycle');

   expect(all).toHaveLength(62);
   expect(all).toContain('what/jeep-wrangler');

   expect(two).toHaveLength(2);
   expect(two).toContain('what/bicycle');
});

test('Includes all photo tags with their full names', () => {
   expect(photoBlog.tags).toHaveKeys(
      'algae',
      'andersonranchreservoir',
      'dam',
      'horse',
      'jason'
   );
   expect(photoBlog.tags.get('andersonranchreservoir')).toBe(
      'Anderson Ranch Reservoir'
   );
});

test('Has post summaries', () => {
   expect(photoBlog.posts).toHaveLength(168);
});

test('Finds posts by ID or key', () => {
   const post1 = photoBlog.postWithID('72157666685116730');

   expect(post1).toBeDefined();
   expect(post1.title).toBe('Spring Fish & Chips');
   expect(post1.photoCount).toBe(32);

   const post2 = photoBlog.postWithKey('owyhee-snow-and-sand/lowlands');

   expect(post2).toBeDefined();
   expect(post2.title).toBe('Owyhee Snow and Sand');
   expect(post2.subTitle).toBe('Lowlands');
});

test('Removes posts', () => {
   let post = photoBlog.postWithKey('owyhee-snow-and-sand/lowlands');
   expect(post).toBeDefined();
   photoBlog.remove(post.key);
   post = photoBlog.postWithKey('owyhee-snow-and-sand/lowlands');
   expect(post).not.toBeDefined();
});

test('Finds post having a photo', async () => {
   const post = await photoBlog.postWithPhoto('8459503474');
   expect(post).toBeDefined();
   expect(post).toHaveProperty('id', '72157632729508554');
});

test('Finds photos with tags', async () => {
   const photos = await photoBlog.getPhotosWithTags('horse');
   expect(photos).toBeDefined();
   expect(photos).toBeInstanceOf(Array);
   expect(photos).toHaveLength(10);
   expect(photos[0]).toHaveAllProperties('id', 'size');
});

test('Creates list of post keys', () => {
   const keys = photoBlog.postKeys();
   expect(keys).toHaveLength(167);
   expect(keys).toContain('brother-ride-2015/simmons-creek');
});

test('Can be emptied', () => {
   photoBlog.empty();
   expect(photoBlog.loaded).toBe(false);
   expect(photoBlog.posts).toBeNull();
});

test('Reloads blog and identifies changed cache keys', async () => {
   const postKeys = [
      'owyhee-snow-and-sand/lowlands',
      'kuna-cave-fails-to-impress'
   ];
   photoBlog.remove(...postKeys);

   await loadPhotoBlog(photoBlog);

   const changes = photoBlog.changedKeys;

   expect(changes).toBeInstanceOf(Array);
   expect(changes).toContain(postKeys[0]);
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
