# simple-text-overlay

Demos (click to view on Youtube)

[![https://youtu.be/oFHYaB9n5bk?si=6bqOO1RNWYpVwEx4](https://img.youtube.com/vi/oFHYaB9n5bk/0.jpg)](https://www.youtube.com/watch?v=oFHYaB9n5bk)

[![https://www.youtube.com/watch?v=lkshQctBXG4](https://img.youtube.com/vi/lkshQctBXG4/0.jpg)](https://www.youtube.com/watch?v=lkshQctBXG4)

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
  { start: 0, text: 'Hello' },
  { start: 1, text: 'World!' },
  { start: 2, text: 'Each' },
  { start: 3, text: 'second' },
  { start: 4, text: 'is' },
  { start: 5, text: 'a' },
  { start: 6, text: 'new' },
  { start: 7, text: 'caption.' },
];

// optional config
const config = {};

addOverlay('src.mp4', overlays, 'output.mp4', config);
```

For more examples see the examples folder.

# Documentation

## Overview

The `addOverlay` function adds text overlays to a video file. It allows you to specify multiple overlays with configurable parameters such as text content, display duration, position, font settings, background style, and optional animations. You can also specify an audio file to be added with the overlay.

- [Overview](#overview)
- [Function Signature](#function-signature)
- [Parameters](#parameters)
- [Types](#types)
  - [Overlay](#overlay)
  - [OverlayConfig](#overlayconfig)
  - [FontConfig](#fontconfig)
  - [BackgroundConfig](#backgroundconfig)
  - [AnimationConfig](#animationconfig)
- [Example Usage](#example-usage)

## Function Signature

```typescript
export const addOverlay = async (
  src: string,
  overlays: Overlay[],
  output: string,
  config?: OverlayConfig
): Promise<void>;
```

## Parameters

- `src` (`string`): The source video file path.
- `overlays` (`Overlay[]`): An array of `Overlay` objects specifying the text overlays to be added.
- `output` (`string`): The output file path where the video with overlays will be saved.
- `config` (`OverlayConfig`, optional): Additional configuration options for the overlays.

## Types

### Overlay

An overlay object defines a text overlay that will be displayed on the video.

```typescript
export type Overlay = {
  text: string; // The text content of the overlay.
  start: number; // The start time (in seconds) when the overlay should appear.
  end?: number; // The end time (in seconds) when the overlay should disappear. If undefined, will default to the next overlay's start or the duration of the clip
};
```

### OverlayConfig

The complete configuration options for the overlays.

```typescript
export type OverlayConfig = {
  audioPath?: string; // Optional path of an audio file to add to the video with the text overlay.
  fontConfig?: FontConfig; // Optional configuration of the font used for the overlay.
  backgroundConfig?: BackgroundConfig; // Optional configuration of the background of the overlay.
  animationConfig?: AnimationConfig; // Optional configuration of the animation of the overlay.
  overlayAlign?: OverlayAlignOptions; // Optional position of the overlay on the video.
  overlayMargin?: number; // Optional margin of the overlay in pixels.
};
```

### FontConfig

Configuration options for the font used in the overlays.

```typescript
export type FontConfig = {
  name?: string; // The name of the font (e.g., Arial).
  size?: number; // The font size in pixels.
  color?: string; // The font color (e.g., white).
  lineHeight?: number; // The line height of the text.
  weight?: 'normal' | 'bold' | 'bolder' | 'lighter' | number; // The font weight.
};
```

### BackgroundConfig

Configuration options for the background of the overlays.

```typescript
export type BackgroundConfig = {
  color: string; // The background color (e.g., black).
  padding: number; // The padding around the text in pixels.
  borderRadius?: number; // The border radius of the background in pixels (optional).
};
```

### AnimationConfig

Configuration options for the animation effects of the overlays.

```typescript
export type AnimationConfig = {
  duration: number; // The duration of the animation effect in seconds.
};
```

## Example Usage

```typescript
import { addOverlay, Overlay, OverlayConfig } from 'simple-text-overlay';

const overlays: Overlay[] = [
  {
    text: 'Hello, World!',
    start: 0,
  },
  {
    text: 'This is another caption.',
    start: 5,
  },
];

const outputFilePath = './output/video-with-overlays.mp4';

const config: OverlayConfig = {
  fontConfig: {
    name: 'Arial',
    size: 24,
    color: 'white',
  },
  backgroundConfig: {
    color: 'black',
    padding: 10,
  },
  animationConfig: {
    duration: 2,
  },
  overlayAlign: 'bottomRight',
  overlayMargin: 20,
};

await addOverlay('input/video.mp4', overlays, outputFilePath, config);
```

This function allows you to customize how text overlays are displayed on a video, including font style, background, animation, and position, providing flexibility in creating dynamic video content.
