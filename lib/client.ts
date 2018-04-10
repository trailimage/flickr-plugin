import { FlickrClient, FlickrConfig } from '@toba/flickr';

let _client: FlickrClient = null;
let _config: FlickrConfig = null;

export function configure(config: FlickrConfig) {
   _config = config;
}

export const flickr = {
   get client() {
      if (_client == null) {
         if (_config === null) {
            throw new Error('Invalid Flickr client configuration');
         }
         _client = new FlickrClient(_config);
      }
      return _client;
   },

   get config() {
      return _config;
   },

   configure(config: FlickrConfig) {
      _config = config;
   }
};
