import { addOverlay } from 'simple-text-overlay';

const overlays = [
  {
    start: 0.014999999664723873,
    text: 'Hello',
  },
  {
    start: 0.35999998450279236,
    text: 'world!',
  },
  { start: 0.9707916378974915, text: 'This' },
  { start: 1.1807916164398193, text: 'is' },
  { start: 1.2857916355133057, text: 'a' },
  { start: 1.3522499799728394, text: 'test' },
  { start: 1.7322499752044678, text: 'with' },
  { start: 1.8677499294281006, text: 'audio' },
];

addOverlay(`${__dirname}/../src.mp4`, overlays, `${__dirname}/../output.mp4`, {
  audioPath: `${__dirname}/../src.mp3`,
});
