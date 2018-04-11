import '@toba/test';
import './client.test';
import { Flickr } from '@toba/flickr';
import { flickr } from './client';
import { loadPost, timeStampToDate } from './post';

let res: Flickr.Collection[];

beforeAll(async () => {
   res = await flickr.client.getCollections();
   expect(res).toBeDefined();
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
});
