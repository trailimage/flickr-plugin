import { FlickrClient, FlickrConfig } from '@toba/flickr';
import { provider } from './provider';

let _client: FlickrClient | null = null;

function ensureAPI() {
   if (provider.config.api === undefined) {
      throw new Error('Invalid Flickr client configuration');
   }
}

export const flickr = {
   get client() {
      if (_client == null) {
         ensureAPI();
         _client = new FlickrClient(provider.config.api!);
      }
      return _client;
   },

   get config(): FlickrConfig {
      ensureAPI();
      return provider.config.api!;
   }
};
