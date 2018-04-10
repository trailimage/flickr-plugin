import { Flickr } from '@toba/flickr';
import { is, inDaylightSavings } from '@toba/tools';
import { Photo } from '@trailimage/models';
//import { loadPhotoSize } from './photo-size';
import { config } from './config';

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
   const h = time[0] - config.timeZoneOffset;
   // date constructor automatically converts to local time
   const d = new Date(
      Date.UTC(date[0], date[1] - 1, date[2], h, time[1], time[2])
   );
   if (inDaylightSavings(d)) {
      d.setHours(d.getHours() - 1);
   }
   return d;
}

export function loadPhoto(summary: Flickr.PhotoSummary, index: number): Photo {
   const photo = new Photo(summary.id, index);

   photo.sourceUrl = 'flickr.com/photos/' + summary.pathalias + '/' + summary.id;
   photo.title = summary.title;
   photo.description = summary.description._content;
   // tag slugs are later updated to proper names
   photo.tags = is.empty(summary.tags) ? [] : summary.tags.split(' ');
   photo.dateTaken = parseDate(summary.datetaken);
   photo.latitude = parseFloat(summary.latitude);
   photo.longitude = parseFloat(summary.longitude);
   //photo.primary = parseInt(json.isprimary) == 1;

   photo.outlierDate = false;

   // photo.size = {
   //    preview: loadPhotoSize(json, config.style.photoSizes.preview),
   //    normal: loadPhotoSize(json, config.style.photoSizes.normal),
   //    big: loadPhotoSize(json, config.style.photoSizes.big)
   // };

   return photo;
}
