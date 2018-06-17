import { PostProvider, Post } from '@trailimage/models';
import { Flickr } from '@toba/flickr';
import { loadPhotoBlog } from './photo-blog';
import { ProviderConfig } from './index';
import { photosWithTags } from './photo';
import { loadInfo, loadPhotos, postIdWithPhotoId } from './post';
import { loadEXIF } from './exif';
import { flickr } from './client';

class FlickrProvider extends PostProvider<ProviderConfig> {
   photoBlog = (async = true) => loadPhotoBlog(async);
   add = (b: number): number => b;
   exif = (photoID: string) => loadEXIF(photoID);
   postIdWithPhotoId = (photoID: string) => postIdWithPhotoId(photoID);
   photosWithTags = (...tags: string[]) => photosWithTags(tags);
   postInfo = (p: Post) => loadInfo(p);
   postPhotos = (p: Post) => loadPhotos(p);
   authorizationURL = () => flickr.client.getRequestToken();
   getAccessToken = (requestToken: string, verifier: string) =>
      flickr.client.getAccessToken(requestToken, verifier);
}

export const provider = new FlickrProvider({
   photoSizes: {
      thumb: [Flickr.SizeCode.Square150],
      preview: [Flickr.SizeCode.Large1024],
      normal: [Flickr.SizeCode.Large1024],
      big: [Flickr.SizeCode.Large1024]
   },
   api: null
});
