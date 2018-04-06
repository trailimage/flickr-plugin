import { PostProvider } from '@trailimage/models';
import { FlickrClient } from '@toba/flickr';
import { loadPhotoBlog, postIdWithPhotoId, photosWithTags } from './photo-blog';
import { config } from './config';
import { loadInfo, loadPhotos } from './post';
import { loadEXIF } from './exif';

export const provider: PostProvider = {
   photoBlog: loadPhotoBlog,
   exif: loadEXIF,
   postIdWithPhotoId,
   photosWithTags,
   postInfo: loadInfo,
   postPhotos: loadPhotos
};

/**
 * Singleton Flickr client.
 */
export const flickr = new FlickrClient(config);
