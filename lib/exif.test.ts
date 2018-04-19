import '@toba/test';
import { loadEXIF } from './exif';
import { flickr } from './client';
import { testConfig } from './.test-data';

beforeAll(() => {
   flickr.configure(testConfig);
});

test('loads photo EXIF', async () => {
   const exif = await loadEXIF('photo-id');
   expect(exif).toBeDefined();
   expect(exif.model).toBe('Nikon D700');
   expect(exif.software).toBe('Adobe Lightroom 6.3');
   expect(exif.fNumber).toBe(5.6);
   expect(exif.focalLength).toBeNull();
   expect(exif.lens).toBe('Voigtländer Nokton 58mm ƒ1.4 SL II');
});
