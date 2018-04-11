import { PostProvider } from '@trailimage/models';
import { loadPhotoBlog } from './photo-blog';
import { photosWithTags } from './photo';
import { loadInfo, loadPhotos, postIdWithPhotoId } from './post';
import { loadEXIF } from './exif';

export const provider: PostProvider = {
   photoBlog: loadPhotoBlog,
   exif: loadEXIF,
   postIdWithPhotoId,
   photosWithTags,
   postInfo: loadInfo,
   postPhotos: loadPhotos
};
