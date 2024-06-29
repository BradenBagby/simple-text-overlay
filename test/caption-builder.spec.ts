import { join } from 'path';
import { buildCaption } from '../src/caption-builder';
import { OverlayConfig } from '../src/types';
import { TEST_OUTPUT_PATH } from './constants';

describe('caption-builder', () => {
  const bounds = { width: 600, height: 2000 };
  const config: OverlayConfig = {};
  const getTestOutput = (name: string) => join(TEST_OUTPUT_PATH, name);

  test('should build caption for a long sentence', async () => {
    await buildCaption(
      'Hello World, this is a long enough sentence where it should wrap around to two lines. Maybe even three. Who knows? Its just a long sentence here. Hello World, this is a long enough sentence where it should wrap around to two lines. Maybe even three. Who knows? Its just a long sentence here. Hello World, this is a long enough sentence where it should wrap around to two lines. Maybe even three. Who knows? Its just a long sentence here. Hello World, this is a long enough sentence where it should wrap around to two lines. Maybe even three. Who knows? Its just a long sentence here',
      config,
      bounds,
      getTestOutput('build-caption.png')
    );
  });

  test('should build caption for a single line', async () => {
    await buildCaption(
      'Hello World',
      config,
      bounds,
      getTestOutput('build-caption-single-line.png')
    );
  });

  test('should build caption for a two lines', async () => {
    await buildCaption(
      'Hello World, this is a long enough sentence',
      config,
      bounds,
      getTestOutput('build-caption-two-lines.png')
    );
  });
});
