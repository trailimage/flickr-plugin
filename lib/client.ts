import { is } from '@toba/tools';
import { FlickrClient, FlickrConfig } from '@toba/flickr';
import { config } from '../';

let _client: FlickrClient = null;

export const flickr = {
   get client() {
      if (_client == null) {
         if (!is.value(config.api)) {
            throw new Error('Invalid Flickr client configuration');
         }
         _client = new FlickrClient(config.api);
      }
      return _client;
   },

   get config(): FlickrConfig {
      return config.api;
   }
};
