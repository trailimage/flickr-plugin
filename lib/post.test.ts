import '@toba/test';
import './client.test';
import { Flickr } from '@toba/flickr';
import { flickr } from './client';
import {
   loadPost,
   timeStampToDate,
   loadInfo,
   loadPhotos,
   postIdWithPhotoId
} from './post';

let res: Flickr.Collection[];

beforeAll(async () => {
   res = await flickr.client.getCollections();
   expect(res).toBeDefined();
});

test('Finds post containing photo', () => {
   expect(postIdWithPhotoId).toBeDefined();
});

test('Creates date from timestamp', () => {
   const d = timeStampToDate('55432222');
   expect(d).toBeInstanceOf(Date);
});

test('Loads post from Flickr data', () => {
   const post = loadPost(res[0].collection[0].set[0]);
   expect(post).toBeDefined();
   expect(post.id).toBe('72157666725213214');
   expect(post.title).toBe('Stanley Lake Snow Hike');
   expect(post.infoLoaded).toBe(false);
   expect(post.photosLoaded).toBe(false);
});

test('Loads post info from Flickr data', async () => {
   const post = loadPost(res[0].collection[0].set[0]);

   await loadInfo(post);

   expect(post.infoLoaded).toBe(true);
   expect(post.photosLoaded).toBe(false);
});

test('Loads photo info from Flickr data', async () => {
   const post = loadPost(res[0].collection[0].set[0]);

   await loadPhotos(post);

   expect(post.infoLoaded).toBe(false);
   expect(post.photosLoaded).toBe(true);
   expect(post.photos.length).toBe(13);
   expect(post.photos[0].title).toBe('Slow roasted');
});
