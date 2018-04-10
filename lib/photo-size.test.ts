import '@toba/test';
import { Flickr } from '@toba/flickr';
import { loadPhotoSize } from './photo-size';
import { client, configure } from './client';
import { testConfig } from './client.test';

let res: Flickr.SetPhotos;

configure(testConfig);

beforeAll(async () => {
   res = await client().getSetPhotos('any-id');
   expect(res).toBeDefined();
});

test('Selects photo size', async () => {
   const size = loadPhotoSize(res.photo[0], Flickr.SizeCode.Large1024);
   expect(size).toBeDefined();
   expect(size.url).toBe(
      'https://farm9.staticflickr.com/8109/8459503474_7fcb90b3e9_b.jpg'
   );
});

test('Only selects available photo size', () => {
   const size = loadPhotoSize(
      res.photo[1],
      Flickr.SizeCode.Original,
      Flickr.SizeCode.Large1024
   );
   expect(size.url).toBe(
      'https://farm9.staticflickr.com/8518/8459508508_01789c3f82_b.jpg'
   );
});

test('Returns null if no photo sizes match preference', () => {
   const size = loadPhotoSize(res.photo[1], Flickr.SizeCode.Original);
   expect(size).toBeNull();
});
