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
   photoBlog = (async = true) => loadPhotoBlog(async);
   exif = (photoID: string) => loadEXIF(photoID);
   postIdWithPhotoId = (photoID: string) => postIdWithPhotoId(photoID);
   photosWithTags = (...tags: string[]) => photosWithTags(...tags);
   postInfo = (p: Post) => loadInfo(p);
   postPhotos = (p: Post) => loadPhotos(p);
   authorizationURL = () => flickr.client.getRequestToken();

   getAccessToken(req: IncomingMessage): Promise<Token> {
      const url = parse(req.url!, true);
      const requestToken = unlist(url.query['oauth_token'], true);
      const verifier = unlist(url.query['oauth_verifier'], true);
      return flickr.client.getAccessToken(requestToken, verifier);
   }

   clearCache() {
      flickr.client.clearCache();
   }

   /**
    * Merge configuration as normal then copy sizes to API configuration.
    */
   configure(newConfig: Partial<ProviderConfig>): void {
      super.configure(newConfig);
      const sizes = this.config.photoSizes;

      if (this.config.api === undefined) {
         return;
      }

      this.config.api.setPhotoSizes = [
         ...sizes.big,
         ...sizes.normal,
         ...sizes.preview,
         ...sizes.thumb
      ];
   }
}

export const provider = new FlickrProvider({
   photoSizes: {
      thumb: [Flickr.SizeCode.Square150],
      preview: [Flickr.SizeCode.Large1024],
      normal: [Flickr.SizeCode.Large1024],
      big: [Flickr.SizeCode.Large1024]
   },
   api: undefined
});
