import { Flickr } from '@toba/flickr';
import { EXIF } from '@trailimage/models';
import { flickr } from './client';

/**
 * Create EXIF from Flickr data.
 */
export async function loadEXIF(photoID: string): Promise<EXIF> {
   const flickrExif: Flickr.Exif[] | null = await flickr.client.getExif(
      photoID
   );
   const exif = new EXIF();

   if (flickrExif !== null) {
      exif.artist = parse(flickrExif, 'Artist');
      exif.compensation = parse(flickrExif, 'ExposureCompensation');
      exif.time = parse(flickrExif, 'ExposureTime', '0');
      exif.fNumber = parseFloat(parse(flickrExif, 'FNumber', '0')!);
      exif.focalLength = 0; // calculated in sanitize()
      exif.ISO = parseFloat(parse(flickrExif, 'ISO', '0')!);
      exif.lens = parse(flickrExif, 'Lens');
      exif.model = parse(flickrExif, 'Model');
      exif.software = parse(flickrExif, 'Software');
   }

   return exif.sanitize();
}

/**
 *
 * @param exif
 * @param tag
 * @param empty
 */
export function parse(exif: Flickr.Exif[], tag: string, empty?: string) {
   for (const key in exif) {
      const item = exif[key];
      if (item.tag == tag) {
         return item.raw._content;
      }
   }
   return empty;
}
