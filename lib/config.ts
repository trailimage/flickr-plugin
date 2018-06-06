import { Flickr, FlickrConfig } from '@toba/flickr';

export interface FeatureSet {
   id: string;
   title: string;
}

export interface ProviderConfig {
   /** Flickr size codes in order of preference. */
   photoSizes: {
      /** Size at which to preview the photo such as in search results. */
      preview: Flickr.SizeCode[];
      /** Normal photo size shown within post. */
      normal: Flickr.SizeCode[];
      /** Size shown when post photo is clicked for enlargmenet. */
      big: Flickr.SizeCode[];
   };
   /** Flickr API configuration. */
   api: FlickrConfig;
   /** Optional set IDs to feature. */
   featureSets?: FeatureSet[];
}

export const config: ProviderConfig = {
   photoSizes: {
      preview: [Flickr.SizeCode.Large1024],
      normal: [Flickr.SizeCode.Large1024],
      big: [Flickr.SizeCode.Large1024]
   },
   api: null
};
