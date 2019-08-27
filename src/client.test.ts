import '@toba/test';
import { FlickrClient } from '@toba/flickr';
import { flickr } from './client';

test('Throws exception for invalid configuration', () => {
   let e: Error;
   let c: FlickrClient;

   try {
      c = flickr.client;
   } catch (err) {
      e = err;
   }
   expect(c).toBeUndefined();
   expect(e).toBeDefined();
   expect(e.message).toBe('Invalid Flickr client configuration');
});

test('Allows configuration', async () => {
   let e: Error;
   let c: FlickrClient;

   await import('./.test-data');

   try {
      c = flickr.client;
   } catch (err) {
      e = err;
   }
   expect(c).toBeDefined();
   expect(e).toBeUndefined();
});
