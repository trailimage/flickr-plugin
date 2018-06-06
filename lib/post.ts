import { Flickr, FeatureSet } from '@toba/flickr';
import { is, parseNumber } from '@toba/tools';
import { log } from '@toba/logger';
import {
   Post,
   Photo,
   blog,
   identifyOutliers
} from '@trailimage/models';
import { flickr } from './client';
import { loadVideoInfo } from './video-info';
import { loadPhoto } from './photo';

/**
 * Convert Flickr timestamp to `Date` instance. Timestamps are created on hosted
 * servers so time zone isn't known.
 */
export function timeStampToDate(timestamp: Date | number | string): Date {
   if (is.date(timestamp)) {
      return timestamp;
   } else if (is.text(timestamp)) {
      timestamp = parseNumber(timestamp);
   }
   return new Date(timestamp * 1000);
}

/**
 * Convert Flickr timestamp to ISO 8601 string.
 *
 * @example 2013-10-02T11:55Z
 * @see http://en.wikipedia.org/wiki/ISO_8601
 * @see https://developers.facebook.com/docs/reference/opengraph/object-type/article/
 */
export const timeStampToIsoString = (timestamp: number | Date) =>
   timeStampToDate(timestamp).toISOString();

/**
 * Get first post that includes the given photo.
 */
export async function postIdWithPhotoId(photoID: string): Promise<string> {
   const photoSets = await flickr.client.getPhotoContext(photoID);
   return is.value(photoSets) ? photoSets[0].id : null;
}

/**
 * Create post from Flickr photo set.
 *
 * @param chronoligical Whether set photos occurred together at a point in time
 */
export function loadPost(
   flickrSet: Flickr.SetSummary | FeatureSet,
   chronological: boolean = true
): Post {
   const p = new Post();

   p.id = flickrSet.id;
   p.chronological = chronological;

   return p.inferTitleAndKey(flickrSet.title);
}

export const loadInfo = (p: Post): Promise<Post> =>
   flickr.client.getSetInfo(p.id).then(info => updateInfo(p, info));

export const loadPhotos = (p: Post): Promise<Photo[]> =>
   flickr.client.getSetPhotos(p.id).then(res => updatePhotos(p, res));

/**
 * Update post with Flickr set information.
 */
function updateInfo(p: Post, setInfo: Flickr.SetInfo): Post {
   const thumb = `http://farm${setInfo.farm}.staticflickr.com/${
      setInfo.server
   }/${setInfo.primary}_${setInfo.secret}`;

   // removes video information from setInfo.description
   p.video = loadVideoInfo(setInfo);
   p.createdOn = timeStampToDate(setInfo.date_create);
   p.updatedOn = timeStampToDate(setInfo.date_update);
   p.photoCount = setInfo.photos;

   if (is.empty(p.description)) {
      // keep existing description if already populated -- this simplifies tests
      // that get all correct descriptions from single getTree call that would
      // be replaced by per-post mock call
      p.description = setInfo.description._content;
   }
   p.description = p.description.replace(/[\r\n\s]*$/, '');

   // long description is updated after photos are loaded
   p.longDescription = p.description;
   // http://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[mstzb].jpg
   // http://farm{{info.farm}}.static.flickr.com/{{info.server}}/{{info.primary}}_{{info.secret}}.jpg'
   // thumb URLs may be needed before photos are loaded, e.g. in RSS XML
   p.bigThumbURL = thumb + '.jpg'; // 500px
   p.smallThumbURL = thumb + '_s.jpg';
   p.infoLoaded = true;

   return p;
}

function updatePhotos(p: Post, setPhotos: Flickr.SetPhotos): Photo[] {
   p.photos = setPhotos.photo.map((img, index) => loadPhoto(img, index));

   if (p.photos.length > 0) {
      p.coverPhoto = p.photos.find(img => img.primary);

      if (!is.value(p.coverPhoto)) {
         log.error(`No cover photo defined for ${p.title}`);
         p.coverPhoto = p.photos[0];
      }

      // also updates photo tag keys to full names
      p.photoTagList = blog.photoTagList(p.photos);

      if (p.chronological) {
         identifyOutliers(p.photos);
         const firstDatedPhoto = p.photos.find(i => !i.outlierDate);
         if (is.value(firstDatedPhoto)) {
            p.happenedOn = firstDatedPhoto.dateTaken;
         }
      }

      if (!is.empty(p.description)) {
         p.longDescription = `${p.description} (Includes ${
            p.photos.length
         } photos`;
         p.longDescription +=
            is.value(p.video) && !p.video.empty ? ' and one video)' : ')';
      }

      p.updatePhotoLocations();
   }
   p.photosLoaded = true;

   return p.photos;
}
