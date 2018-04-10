import '@toba/test';
import { FlickrClient, FlickrConfig, Flickr } from '@toba/flickr';
import { flickr } from './client';

export const testConfig: FlickrConfig = {
   appID: '72157631007435048',
   userID: '60950751@N04',
   excludeSets: ['72157631638576162'],
   excludeTags: [
      'Idaho',
      'United States of America',
      'Abbott',
      'LensTagger',
      'Boise'
   ],
   timeZoneOffset: -1,
   featureSets: [{ id: '72157632729508554', title: 'Ruminations' }],
   setPhotoSizes: [Flickr.SizeCode.Large1024],
   useCache: false,
   maxRetries: 1,
   auth: {
      apiKey: 'FLICKR_API_KEY',
      secret: 'FLICKR_SECRET',
      callback: 'http://www.trailimage.com/auth/flickr',
      token: {
         access: 'FLICKR_ACCESS_TOKEN',
         secret: 'FLICKR_TOKEN_SECRET',
         request: null
      }
   }
};

flickr.configure(testConfig);

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
