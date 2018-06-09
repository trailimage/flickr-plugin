import '@toba/test';
import './.test-data';
import { Flickr } from '@toba/flickr';
import { flickr } from './client';
import {
   loadInfo,
   loadPhotos,
   loadPost,
   postIdWithPhotoId,
   timeStampToDate
} from './post';

let res: Flickr.Collection[];

beforeAll(async () => {
   res = await flickr.client.getCollections();
   expect(res).toBeDefined();
});

test('finds post containing photo', async () => {
   const postID: string = await postIdWithPhotoId('photo-id');
   expect(postID).toBe('72157632729508554');
});

test('creates date from timestamp', () => {
   const d = timeStampToDate('55432222');
   expect(d).toBeInstanceOf(Date);
});

test('loads post from Flickr data', () => {
   const post = loadPost(res[0].collection[0].set[0]);
   expect(post).toBeDefined();
   expect(post.id).toBe('72157666725213214');
   expect(post.title).toBe('Stanley Lake Snow Hike');
   expect(post.infoLoaded).toBe(false);
   expect(post.photosLoaded).toBe(false);
});

test('loads post info from Flickr data', async () => {
   const post = loadPost(res[0].collection[0].set[0]);

   await loadInfo(post);

   expect(post.infoLoaded).toBe(true);
   expect(post.photosLoaded).toBe(false);
});

test('loads photo info from Flickr data', async () => {
   const post = loadPost(res[0].collection[0].set[0]);

   await loadPhotos(post);

   expect(post.infoLoaded).toBe(false);
   expect(post.photosLoaded).toBe(true);
   expect(post.photos.length).toBe(13);
   expect(post.photos[0].title).toBe('Slow roasted');
});
