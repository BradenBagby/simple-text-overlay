import { buildImage, getTextSize } from '../src/build-image';
import { COW_PATH, ROBOTO_PATH } from './constants';
import os from 'os';
import path from 'path';
import { v4 } from 'uuid';
import { getSingleFrame } from '../src/utils';

describe.only('build-image', () => {
  describe('getTextSize', () => {
    let singleFrame: string;

    beforeAll(async () => {
      singleFrame = path.join(os.tmpdir(), `${v4()}.png`);
      await getSingleFrame(COW_PATH, singleFrame);
      jest.setTimeout(10000);
    });

    it('should get text size for a single word', async () => {
      const bounds = await getTextSize({
        text: 'Hello',
        singleFrame,
        config: {
          fontPath: ROBOTO_PATH,
          fontSize: 48,
        },
      });
      expect(bounds).toMatchObject({ width: 110, height: 37 });
    });

    it('should get text size for a longer sentence', async () => {
      const bounds = await getTextSize({
        text: 'Hello World, this is a long enough sentence where it should wrap around to two lines. Maybe even three. Who knows? Its just a long sentence here. Hello World, this is a long enough sentence where it should wrap around to two lines. Maybe even three. Who knows? Its just a long sentence here. Hello World, this is a long enough sentence where it should wrap around to two lines. Maybe even three. Who knows? Its just a long sentence here. Hello World, this is a long enough sentence where it should wrap around to two lines. Maybe even three. Who knows? Its just a long sentence here',
        singleFrame,
        config: {
          fontPath: ROBOTO_PATH,
          fontSize: 48,
        },
      });
      expect(bounds).toMatchObject({ width: 110, height: 37 });
    });
  });
});
