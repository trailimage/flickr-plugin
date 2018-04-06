import { PostProvider } from '@trailimage/models';
import { FlickrClient } from '@toba/flickr';
import {
   load,
   loadEXIF,
   loadPostIdWithPhotoId,
   loadPhotosWithTags
} from './photo-blog';
import { loadInfo, loadPhotos } from './post';

export const provider: PostProvider = {
   loadPhotoBlog: load,
   loadEXIF,
   loadPostIdWithPhotoId,
   loadPhotosWithTags,
   loadPostInfo: loadInfo,
   loadPostPhotos: loadPhotos
};

/**
 * Singleton Flickr client.
 */
export const flickr = new FlickrClient(config.flickr);
