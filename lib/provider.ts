import { PostProvider } from '@trailimage/models';
import { loadPhotoBlog, postIdWithPhotoId, photosWithTags } from './photo-blog';
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
