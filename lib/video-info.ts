import { Flickr } from '@toba/flickr';
import { VideoInfo } from '@trailimage/models';

/**
 * Extract video link from specially formatted remark in set description.
 * Example:
 *
 *    Video (960x720): <a href="http://youtu.be/obCgu3yJ4uw" rel="nofollow">youtu.be/obCgu3yJ4uw</a>
 */
const re = /Video(\s*\((\d+)[x×](\d+)\))?:\s*<a[^>]+>[^\/]+\/([\w\-_]+)<\/a>/gi;

/**
 * Get video ID and dimensions
 */
export function make(setInfo: Flickr.SetInfo): VideoInfo {
   const d = setInfo.description._content;

   if (re.test(d)) {
      const match = re.exec(d);
      // remove video link from description
      setInfo.description._content = d.replace(match[0], '');
      return new VideoInfo(match[4], parseInt(match[2]), parseInt(match[3]));
   } else {
      return null;
   }
}
