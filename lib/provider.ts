import { PostProvider } from '@trailimage/models';
import { loadPhotoBlog } from './photo-blog';
import { ProviderConfig } from './index';
import { photosWithTags } from './photo';
import { loadInfo, loadPhotos, postIdWithPhotoId } from './post';
import { loadEXIF } from './exif';

class FlickrProvider extends PostProvider<ProviderConfig> {
   photoBlog = loadPhotoBlog;
   exif = loadEXIF;
   postIdWithPhotoId;
   photosWithTags;
   postInfo = loadInfo;
   postPhotos = loadPhotos;
}

export const provider = new FlickrProvider();

// export const provider: PostProvider = {
//    photoBlog: loadPhotoBlog,
//    exif: loadEXIF,
//    postIdWithPhotoId,
//    photosWithTags,
//    postInfo: loadInfo,
//    postPhotos: loadPhotos
// };
