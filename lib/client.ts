import { FlickrClient, FlickrConfig } from '@toba/flickr';

let _client: FlickrClient = null;
let _config: FlickrConfig = null;

export function configure(config: FlickrConfig) {
   _config = config;
}

/**
 * Singleton Flickr client.
 */
export function client(config: FlickrConfig = null) {
   if (_client == null) {
      if (config !== null) {
         _config = config;
      }
      if (_config === null) {
         throw new Error('Invalid Flickr client configuration');
      }
      _client = new FlickrClient(_config);
   }
   return _client;
}
