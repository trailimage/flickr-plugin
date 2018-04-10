import '@toba/test';
import './client.test';
import { Flickr } from '@toba/flickr';
import { flickr } from './client';
import { parseDate, loadPhoto } from './photo';

let res: Flickr.SetPhotos;

beforeAll(async () => {
   res = await flickr.client.getSetPhotos('id');
   expect(res).toBeDefined();
});

test('Converts Flickr date string to Date', () => {
   const d = parseDate('2012-06-17 17:34:33');
   expect(d).toBeInstanceOf(Date);
   expect(d.getDate()).toBe(17);
   expect(d.getMonth()).toBe(5);
});

test.skip('Adjusts Flickr date to local timezone', () => {
   const d = parseDate('2012-06-17 17:34:33');
   expect(d.getHours()).toBe(17);
});

test('Loads photo from Flickr data', () => {
   const photo = loadPhoto(res.photo[0], 0);
   expect(photo).toBeDefined();
   expect(photo.id).toBe('8459503474');
   expect(photo.title).toBe('Slow roasted');
   expect(photo.primary).toBe(true);
   expect(photo.longitude).toBe(-117.10555);
   expect(photo.sourceUrl).toBe('flickr.com/photos/trailimage/8459503474');
   expect(photo.tags).toEqual([
      'snow',
      'night',
      'fire',
      'washington',
      'abbott',
      'jeremyabbott',
      'jesseabbott'
   ]);
});
