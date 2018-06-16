import { is } from '@toba/tools';
import { FlickrClient, FlickrConfig } from '@toba/flickr';
import { provider } from './provider';

let _client: FlickrClient = null;

export const flickr = {
   get client() {
      if (_client == null) {
         if (!is.value(provider.config.api)) {
            throw new Error('Invalid Flickr client configuration');
         }
         _client = new FlickrClient(provider.config.api);
      }
      return _client;
   },

   get config(): FlickrConfig {
      return provider.config.api;
   }
};
