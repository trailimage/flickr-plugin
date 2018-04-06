import { PostProvider } from '@trailimage/models';
import { FlickrClient } from '@toba/flickr';
import { load, postIdWithPhotoId, photosWithTags } from './photo-blog';
import { loadInfo, loadPhotos } from './post';
import { loadEXIF } from './exif';

export const provider: PostProvider = {
   photoBlog: load,
   exif: loadEXIF,
   postIdWithPhotoId,
   photosWithTags,
   postInfo: loadInfo,
   postPhotos: loadPhotos
};

/**
 * Singleton Flickr client.
 */
export const flickr = new FlickrClient(config.flickr);
