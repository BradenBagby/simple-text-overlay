import { join } from 'path';
import { RESOURCES_PATH, TEST_OUTPUT_PATH } from './constants';
import { addOverlay } from '../src';
import { Overlay, OverlayAlignOptions } from '../src/types';

describe('index', () => {
  const cowVideo = join(RESOURCES_PATH, 'cows-moo.mp4');

  const getTestOutput = (name: string) => join(TEST_OUTPUT_PATH, name);

  const overlays: Overlay[] = [
    { start: 0, end: 1, text: 'Hello' },
    { start: 1, end: 2, text: 'World!' },
    { start: 2, end: 3, text: 'Each' },
    { start: 3, end: 4, text: 'second' },
    { start: 4, end: 5, text: 'is' },
    { start: 5, end: 6, text: 'a' },
    { start: 6, end: 7, text: 'new' },
    { start: 7, end: 8, text: 'caption.' },
  ];

  it('should generate captions for a video at all aligns', async () => {
    const aligns: OverlayAlignOptions[] = [
      'topLeft',
      'bottomLeft',
      'centerLeft',
      'topRight',
      'bottomRight',
      'centerRight',
      'topCenter',
      'bottomCenter',
      'centerCenter',
    ];
    await Promise.all(
      aligns.map(align =>
        addOverlay(cowVideo, overlays, getTestOutput(`cow-${align}.mp4`), {
          overlayAlign: align,
        })
      )
    );
  }, 100000);
});
