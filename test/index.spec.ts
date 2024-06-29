import { join } from 'path';
import { RESOURCES_PATH, TEST_OUTPUT_PATH } from './constants';
import { addOverlay } from '../src';
import { Overlay } from '../src/types';

describe.only('index', () => {
  const cowVideo = join(RESOURCES_PATH, 'cows-moo.mp4');

  const getTestOutput = (name: string) => join(TEST_OUTPUT_PATH, name);

  it('should generate captions for a video', async () => {
    const overlays: Overlay[] = [
      { start: 0, end: 1, text: 'Hello' },
      { start: 1, end: 2, text: 'World!' },
      { start: 2, end: 3, text: 'Each' },
      { start: 3, end: 4, text: 'second' },
      { start: 4, end: 5, text: 'is' },
      { start: 5, end: 6, text: 'a' },
      { start: 6, end: 7, text: 'new' },
      { start: 7, end: 8, text: 'caption.' },
      { start: 8, end: 9, text: 'It' },
      { start: 9, end: 10, text: 'should' },
      { start: 10, end: 11, text: 'end' },
      { start: 11, end: 12, text: 'at' },
      { start: 12, end: 13, text: 'exactly' },
      { start: 13, end: 14, text: '15' },
      { start: 14, end: 15, text: 'seconds!' },
    ];
    await addOverlay(cowVideo, overlays, getTestOutput('cow-captions.mp4'));
  }, 10000);
});
