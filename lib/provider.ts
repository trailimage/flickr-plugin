import { PostProvider, Post } from '@trailimage/models';
import { IncomingMessage } from 'http';
import { parse } from 'url';
import { unlist } from '@toba/tools';
import { Flickr } from '@toba/flickr';
import { Token } from '@toba/oauth';
import { loadPhotoBlog } from './photo-blog';
import { ProviderConfig } from './index';
import { photosWithTags } from './photo';
import { loadInfo, loadPhotos, postIdWithPhotoId } from './post';
import { loadEXIF } from './exif';
import { flickr } from './client';

class FlickrProvider extends PostProvider<ProviderConfig> {
   photoBlog(async = true) {
      return loadPhotoBlog(async);
   }

   exif(photoID: string) {
      return loadEXIF(photoID);
   }

   postIdWithPhotoId(photoID: string) {
      return postIdWithPhotoId(photoID);
   }

   photosWithTags(...tags: string[]) {
      return photosWithTags(...tags);
   }

   postInfo(p: Post) {
      return loadInfo(p);
   }

   postPhotos(p: Post) {
      return loadPhotos(p);
   }

   authorizationURL() {
      return flickr.client.getRequestToken();
   }

   getAccessToken(req: IncomingMessage): Promise<Token> {
      const url = parse(req.url, true);
      const requestToken = unlist(url.query['oauth_token'], true);
      const verifier = unlist(url.query['oauth_verifier'], true);
      return flickr.client.getAccessToken(requestToken, verifier);
   }
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
