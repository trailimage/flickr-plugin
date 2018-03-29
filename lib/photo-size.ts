import { is } from '@toba/tools';
import { PhotoSize } from '@trailimage/models';

export function make(json: any, sizeField: string | string[]): PhotoSize {
   const size = {
      url: null as string,
      width: 0,
      height: 0,
      // whether size is empty
      get isEmpty() {
         return this.url === null && this.width === 0;
      }
   };
   let field = null;

   if (is.array(sizeField)) {
      // iterate through size preferences to find first that isn't empty
      for (field of sizeField) {
         // break with given size url assignment if it exists in the photo summary
         if (!is.empty(json[field])) {
            break;
         }
      }
   } else {
      field = sizeField;
   }

   if (field !== null) {
      const suffix = field.replace('url', '');

      if (!is.empty(json[field])) {
         size.url = json[field];
         size.width = parseInt(json['width' + suffix]);
         size.height = parseInt(json['height' + suffix]);
      }
   }
   return size;
}
