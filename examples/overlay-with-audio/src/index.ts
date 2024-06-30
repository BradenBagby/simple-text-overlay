import { addOverlay } from 'simple-text-overlay';

const overlays = [
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

addOverlay(`${__dirname}/../src.mp4`, overlays, `${__dirname}/../output.mp4`, {
    audioPath: `${__dirname}/../src.mp3`,
})
