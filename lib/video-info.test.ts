import '@toba/test';
import './client.test';
import { Flickr } from '@toba/flickr';
import { flickr } from './client';
import { loadVideoInfo } from './video-info';

let res: Flickr.SetInfo;

beforeAll(async () => {
   res = await flickr.client.getSetInfo('id');
   expect(res).toBeDefined();
});

test('Constructs video info object', () => {
   const info = loadVideoInfo(res);
   expect(info).not.toBeNull();
   expect(info.height).toBe(576);
   expect(info.id).toBe('uGxqyqQPSzU');
});

test('Removes video information from description', () => {
   loadVideoInfo(res);
   expect(res.description._content).toBe(
      'On the third and fourth days of our annual Brother Ride, we leave the beautiful campsite along the shore of high mountain Big Trinity Lake with plans to descend to historic Atlanta, Idaho, then venture on trails unknown to camp along the North Fork of the Boise River before returning home.'
   );
});
