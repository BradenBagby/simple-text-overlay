# simple-text-overlay

## Installation

```bash
npm install simple-text-overlay
```

## Prerequisites

### ffmpeg and ffprobe

This package uses fluent-ffmpeg as a dependency to add the overlays on the video. You will need ffmpeg installed on your machine.

see fluent-ffmpeg package for prerequisites and installing ffmpeg
[fluent-ffmpeg](https://www.npmjs.com/package/fluent-ffmpeg?activeTab=readme)

## Usage

This example shows a simple overlay with the default config. For all config options refer to the documentation.

```ts
import { addOverlay, Overlay } from 'simple-text-overlay';

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

// optional config
const config = {};

addOverlay('src.mp4', overlays, 'output.mp4', config);
```
