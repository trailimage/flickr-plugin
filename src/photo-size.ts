import { Flickr } from '@toba/flickr';
import { is } from '@toba/tools';
import { PhotoSize } from '@trailimage/models';

/**
 * Return size object for first result matching size preferences.
 */
export function loadPhotoSize(
   res: Flickr.PhotoSummary,
   ...sizePref: Flickr.SizeCode[]
): PhotoSize {
   let sizeCode: string = null;
   let exists = false;

   // iterate through size preferences to find first that isn't empty
   for (sizeCode of sizePref) {
      // break with given size url assignment if it exists in the photo summary
      if (!is.empty(res[sizeCode])) {
         exists = true;
         break;
      }
   }

   if (exists) {
      const suffix = sizeCode.replace('url', '');

      return new PhotoSize(
         parseInt(res['width' + suffix]),
         parseInt(res['height' + suffix]),
         res[sizeCode]
      );
   }
   return null;
}
