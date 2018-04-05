import { is, parseNumber } from '@toba/tools';
import { FlickrClient } from '@toba/flickr';

export { make as makePhotoBlog } from './lib/photo-blog';
export { make as makeCategory } from './lib/category';
export { make as makePhoto } from './lib/photo';
export { make as makePost } from './lib/post';
export { make as makePhotoSize } from './lib/photo-size';
export { make as makeVideoInfo } from './lib/video-info';
export { make as makeEXIF } from './lib/exif';

/**
 * Singleton Flickr client.
 */
export const flickr = new FlickrClient(config.flickr);

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
