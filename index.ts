import { is, parseNumber } from '@toba/tools';

// export { load as loadPhotoBlog } from './lib/photo-blog';
// export { load as loadCategory } from './lib/category';
// export { load as loadPhoto } from './lib/photo';
// export { load as loadPost } from './lib/post';
// export { load as loadPhotoSize } from './lib/photo-size';
// export { load as loadVideoInfo } from './lib/video-info';
// export { load as loadEXIF } from './lib/exif';

/**
 * Timestamps are created on hosted servers so time zone isn't known.
 */
export function timeStampToDate(timestamp: Date | number | string): Date {
   if (is.date(timestamp)) {
      return timestamp;
   } else if (is.text(timestamp)) {
      timestamp = parseNumber(timestamp);
   }
   return new Date(timestamp * 1000);
}

/**
 * Example 2013-10-02T11:55Z
 *
 * http://en.wikipedia.org/wiki/ISO_8601
 * https://developers.facebook.com/docs/reference/opengraph/object-type/article/
 */
export const iso8601time = (timestamp: number | Date) =>
   timeStampToDate(timestamp).toISOString();
