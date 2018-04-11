import '@toba/test';
import { FlickrClient } from '@toba/flickr';
import { flickr } from './client';
import { testConfig } from './config';

test('Throws exception for invalid configuration', () => {
   let e: Error;
   let c: FlickrClient;

   flickr.configure(null);

   try {
      c = flickr.client;
   } catch (err) {
      e = err;
   }
   expect(c).toBeUndefined();
   expect(e).toBeDefined();
   expect(e.message).toBe('Invalid Flickr client configuration');
});

test('Allows configuration', () => {
   let e: Error;
   let c: FlickrClient;

   flickr.configure(testConfig);

   try {
      c = flickr.client;
   } catch (err) {
      e = err;
   }
   expect(c).toBeDefined();
   expect(e).toBeUndefined();
});
