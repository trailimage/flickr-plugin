import { is } from '@toba/tools';
import { Flickr } from '@toba/flickr';
import { PhotoSize } from '@trailimage/models';

export function loadPhotoSize(
   res: Flickr.PhotoSummary,
   ...sizePref: Flickr.SizeCode[]
): PhotoSize {
   let field: string = null;

   // iterate through size preferences to find first that isn't empty
   for (field of sizePref) {
      // break with given size url assignment if it exists in the photo summary
      if (!is.empty(res[field])) {
         break;
      }
   }

   if (field !== null) {
      const suffix = field.replace('url', '');

      return new PhotoSize(
         parseInt(res['width' + suffix]),
         parseInt(res['height' + suffix]),
         res[field]
      );
   }
   return null;
}
