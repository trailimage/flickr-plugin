import { ModelFactory } from '@trailimage/models';
import {
   make,
   getEXIF,
   getPostWithPhoto,
   getPhotosWithTags
} from './photo-blog';
import { getInfo, getPhotos } from './post';

export const factory: ModelFactory = {
   load: make,
   getEXIF,
   getPostWithPhoto,
   getPhotosWithTags,
   getPostInfo: getInfo,
   getPostPhotos: getPhotos
};
