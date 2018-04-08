import '@toba/test';
import { loadVideoInfo } from './video-info';

test('constructs video info object', () => {
   expect(loadVideoInfo).toBeDefined();
});
