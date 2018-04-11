import { Flickr } from '@toba/flickr';
import { VideoInfo } from '@trailimage/models';

/**
 * Extract video link from specially formatted remark in set description.
 * @example
 *    Video (960x720): <a href="http://youtu.be/obCgu3yJ4uw" rel="nofollow">youtu.be/obCgu3yJ4uw</a>
 */
const re = /Video(\s*\((\d+)[x×](\d+)\))?:\s*<a[^>]+>[^\/]+\/([\w\-_]+)<\/a>/gi;

/**
 * Get video ID and dimensions from Flickr set description.
 */
export function loadVideoInfo(setInfo: Flickr.SetInfo): VideoInfo {
   const d = setInfo.description._content;

   if (re.test(d)) {
      re.lastIndex = 0;
      const match = re.exec(d);
      // remove video link and any trailing space from description
      setInfo.description._content = d
         .replace(match[0], '')
         .replace(/\s+$/, '');
      return new VideoInfo(match[4], parseInt(match[2]), parseInt(match[3]));
   } else {
      return null;
   }
}
