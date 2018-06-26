import '@toba/test';
import './.test-data';
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

   const text =
      'Boulder Basin came to mind when the need for a getaway arose. It’s about as far removed from civilization as you can get in an automobile around here, enough of a trip that you’d best plan on spending the night.';
   const res2: Partial<Flickr.SetInfo> = {
      description: {
         _content: `${text}\n \nVideo (1024x576): <a href="http://youtu.be/8mieqdlWR0E" rel="nofollow">youtu.be/8mieqdlWR0E</a>`
      }
   };

   loadVideoInfo(res2);
   expect(res2.description._content).toBe(text);
});
