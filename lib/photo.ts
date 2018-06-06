import { Flickr } from '@toba/flickr';
import { inDaylightSavings, is } from '@toba/tools';
import { Photo } from '@trailimage/models';
import { loadPhotoSize } from './photo-size';
import { flickr } from './client';
import { config } from '../';

/**
 * Convert text to date object. Date constructor uses local time which we
 * need to defeat since local time will be different on host servers.
 *
 * @example 2012-06-17 17:34:33
 */
export function parseDate(text: string): Date {
   const parts: string[] = text.split(' ');
   const date: number[] = parts[0].split('-').map(d => parseInt(d));
   const time: number[] = parts[1].split(':').map(d => parseInt(d));
   // convert local date to UTC time by adding offset
   const h = time[0] - flickr.config.timeZoneOffset;
   // date constructor automatically converts to local time
   const d = new Date(
      Date.UTC(date[0], date[1] - 1, date[2], h, time[1], time[2])
   );
   if (inDaylightSavings(d)) {
      d.setHours(d.getHours() - 1);
   }
   return d;
}

/**
 * All photos with given tags.
 */
export const photosWithTags = (...tags: string[]) =>
   flickr.client.photoSearch(tags).then(photos => photos.map(loadPhoto));

/**
 * Create photo instance from Flickr photo summary.
 */
export function loadPhoto(summary: Flickr.PhotoSummary, index: number): Photo {
   const photo = new Photo(summary.id, index);

   photo.sourceUrl = `flickr.com/photos/${summary.pathalias}/${summary.id}`;
   photo.title = summary.title;
   photo.description = is.value(summary.description)
      ? summary.description._content
      : null;
   // tag slugs are later updated to proper names
   photo.tags = is.empty(summary.tags)
      ? new Set<string>()
      : new Set<string>(summary.tags.split(' '));
   photo.dateTaken = is.value(summary.datetaken)
      ? parseDate(summary.datetaken)
      : null;
   photo.latitude = is.value(summary.latitude)
      ? parseFloat(summary.latitude)
      : null;
   photo.longitude = is.value(summary.longitude)
      ? parseFloat(summary.longitude)
      : null;
   photo.primary = summary.isprimary == 1;

   // outlier status is calculated later
   photo.outlierDate = false;

   photo.size = {
      preview: loadPhotoSize(summary, ...config.photoSizes.preview),
      normal: loadPhotoSize(summary, ...config.photoSizes.normal),
      big: loadPhotoSize(summary, ...config.photoSizes.big)
   };

   return photo;
}
