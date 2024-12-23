import { join } from 'path';
import { buildCaption } from '../src/caption-builder';
import { TEST_OUTPUT_PATH } from './constants';

describe('caption-builder', () => {
  const bounds = { width: 600, height: 2000 };
  const getTestOutput = (name: string) => join(TEST_OUTPUT_PATH, name);

  describe('simple camption', () => {
    test('should build caption for a long sentence', async () => {
      await buildCaption(
        'Hello World, this is a long enough sentence where it should wrap around to two lines. Maybe even three. Who knows? Its just a long sentence here. Hello World, this is a long enough sentence where it should wrap around to two lines. Maybe even three. Who knows? Its just a long sentence here. Hello World, this is a long enough sentence where it should wrap around to two lines. Maybe even three. Who knows? Its just a long sentence here. Hello World, this is a long enough sentence where it should wrap around to two lines. Maybe even three. Who knows? Its just a long sentence here',
        bounds,
        getTestOutput('caption-long.png')
      );
    });

    test('should build caption for a single line', async () => {
      await buildCaption(
        'Hey World',
        bounds,
        getTestOutput('caption-short.png')
      );
    });

    test('should build caption for a two lines', async () => {
      await buildCaption(
        'Hello World, this is a long enough sentence',
        bounds,
        getTestOutput('caption-medium.png')
      );
    });
  });

  describe('background caption', () => {
    test('should build caption with a background for a single line', async () => {
      await buildCaption(
        'Hey World',
        bounds,
        getTestOutput('caption-background-short.png'),
        { backgroundConfig: { padding: 20, color: 'red' } }
      );
    });

    test('should build caption with a background and border radius for a single line', async () => {
      await buildCaption(
        'Hey World',
        bounds,
        getTestOutput('caption-background-radius-short.png'),
        {
          backgroundConfig: {
            padding: 8,
            color: 'red',
            borderRadius: 12,
          },
        }
      );
    });
  });

  describe('font caption', () => {
    test('should build caption with a bold font', async () => {
      await buildCaption(
        'Hey World',
        bounds,
        getTestOutput('caption-font-bold.png'),
        { fontConfig: { weight: 'bold' } }
      );
    });
  });
});
