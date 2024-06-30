import { join } from 'path';
import { RESOURCES_PATH, TEST_OUTPUT_PATH } from './constants';
import { addOverlay } from '../src';
import { Overlay, OverlayAlignOptions } from '../src/types';

describe('index', () => {
  const cowVideo = join(RESOURCES_PATH, 'cows-moo.mp4');

  const getTestOutput = (name: string) => join(TEST_OUTPUT_PATH, name);

  const overlaysNoAudio: Overlay[] = [
    { start: 0, end: 1, text: 'Hello' },
    { start: 1, end: 2, text: 'World!' },
    { start: 2, end: 3, text: 'Each' },
    { start: 3, end: 4, text: 'second' },
    { start: 4, end: 5, text: 'is' },
    { start: 5, end: 6, text: 'a' },
    { start: 6, end: 7, text: 'new' },
    { start: 7, end: 8, text: 'caption.' },
  ];

  const testAudio = join(RESOURCES_PATH, 'test-audio.mp3');
  const overlaysAudio = [
    {
      start: 0.014999999664723873,
      end: 0.35999998450279236,
      text: 'Hello',
    },
    {
      start: 0.35999998450279236,
      end: 0.9707916378974915,
      text: 'world!',
    },
    { start: 0.9707916378974915, end: 1.1807916164398193, text: 'This' },
    { start: 1.1807916164398193, end: 1.2857916355133057, text: 'is' },
    { start: 1.2857916355133057, end: 1.3522499799728394, text: 'a' },
    { start: 1.3522499799728394, end: 1.7322499752044678, text: 'test' },
    { start: 1.7322499752044678, end: 1.8677499294281006, text: 'with' },
    { start: 1.8677499294281006, end: 4, text: 'audio' },
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
        addOverlay(
          cowVideo,
          overlaysNoAudio,
          getTestOutput(`cow-${align}.mp4`),
          {
            overlayAlign: align,
          }
        )
      )
    );
  }, 100000);

  it('should generate captions for a video with audio', async () => {
    await addOverlay(cowVideo, overlaysAudio, getTestOutput('cow-audio.mp4'), {
      audioPath: testAudio,
    });
  });
});
