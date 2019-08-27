import '@toba/test';
import './.test-data';
import { Flickr } from '@toba/flickr';
import { flickr } from './client';
import { loadPhotoSize } from './photo-size';

let res: Flickr.SetPhotos;

beforeAll(async () => {
   res = await flickr.client.getSetPhotos('any-id');
   expect(res).toBeDefined();
});

test('selects photo size', async () => {
   const size = loadPhotoSize(res.photo[0], Flickr.SizeCode.Large1024);
   expect(size).toBeDefined();
   expect(size.url).toBe(
      'https://farm9.staticflickr.com/8109/8459503474_7fcb90b3e9_b.jpg'
   );
   expect(size.width).toBe(1024);
   expect(size.height).toBe(688);
});

test('only selects available photo size', () => {
   const size = loadPhotoSize(
      res.photo[1],
      Flickr.SizeCode.Original,
      Flickr.SizeCode.Large1024
   );
   expect(size.url).toBe(
      'https://farm9.staticflickr.com/8518/8459508508_01789c3f82_b.jpg'
   );
});

test('returns null if no photo sizes match preference', () => {
   const size = loadPhotoSize(res.photo[1], Flickr.SizeCode.Original);
   expect(size).toBeNull();
});
