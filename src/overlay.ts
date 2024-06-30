import ffmpeg from 'fluent-ffmpeg';
import { mkdir as mkDirCallback } from 'fs';
import os from 'os';
import { join } from 'path';
import { promisify } from 'util';
import { buildCaption } from './caption-builder';
import { Overlay, OverlayConfig } from './types';
import { getVideoInfo, randomHash } from './utils';
export * from './types';

const mkdir = promisify(mkDirCallback);

export const addOverlay = async (
  src: string,
  overlays: Overlay[],
  output: string,
  config?: OverlayConfig
): Promise<void> => {
  const { bounds } = await getVideoInfo(src);

  // build each caption
  const tempDir = join(os.tmpdir(), randomHash());
  await mkdir(tempDir);
  const imageOverlays: ImageOverlay[] = [];
  for (let i = 0; i < overlays.length; i++) {
    const overlay = overlays[i];
    const path = join(tempDir, `${i}.png`);
    const { width, height } = await buildCaption(
      overlay.text,
      bounds,
      path,
      config
    );
    imageOverlays.push({ ...overlay, path, width, height });
  }

  // overlay each caption on the video
  await overlayImagesOnVideo(src, imageOverlays, output, config);
};

export type ImageOverlay = Overlay & {
  path: string;
  width: number;
  height: number;
};
export const overlayImagesOnVideo = async (
  src: string,
  overlays: ImageOverlay[],
  output: string,
  config?: OverlayConfig
): Promise<void> => {
  const margin = config?.overlayMargin || 0;

  // Construct the ffmpeg command
  const command = ffmpeg();
  command.input(src);

  // complex filter for each overlay
  const filters: string[] = [];
  let last = '[0:v]';

  // get position for an overlay
  const getPosition = (overlay: ImageOverlay) => {
    let x = '0';
    let y = '0';

    const centerX = '(main_w-overlay_w)/2';
    const centerY = `(main_h-overlay_h)/2 - ${overlay.height / 2}`;
    const yBottom = `main_h-overlay_h - ${margin}`;
    const xRight = `main_w-overlay_w - ${margin}`;

    switch (config?.overlayAlign) {
      case 'topLeft':
        x = `${margin}`;
        y = `${margin}`;
        break;
      case 'centerLeft':
        x = `${margin}`;
        y = centerY;
        break;
      case 'bottomLeft':
        x = `${margin}`;
        y = yBottom;
        break;
      case 'topCenter':
        x = centerX;
        y = `${margin}`;
        break;
      case 'centerCenter':
        x = centerX;
        y = centerY;
        break;
      case 'topRight':
        x = xRight;
        y = `${margin}`;
        break;
      case 'centerRight':
        x = xRight;
        y = centerY;
        break;
      case 'bottomRight':
        x = xRight;
        y = yBottom;
        break;
      default:
        // bottomCenter is default
        x = centerX;
        y = yBottom;
        break;
    }

    return { x, y };
  };

  let inputs = 0;

  // add audio input
  const audioFilePath = config?.audioPath;
  if (audioFilePath) {
    command.input(audioFilePath);
    inputs++;
  }

  // add each overlay as input and to complex fliter string
  overlays.forEach(overlay => {
    const index = inputs;
    command.input(overlay.path);
    const next = `[outv${index + 1}]`;
    const { x, y } = getPosition(overlay);
    filters.push(
      `${last}[${index + 1}:v]overlay=${x}:${y}:enable='between(t,${
        overlay.start
      },${overlay.end || -1})'${next}` // -1 shouldnt happen if overlay was defaulted correctly
    );
    inputs++;
    last = next;
  });

  // Apply complex filter
  const filterString = filters.join(';');
  await new Promise<void>((resolve, reject) => {
    command.complexFilter(filterString);

    // add or copy audio
    if (audioFilePath) command.outputOptions('-map 1:a:0');
    else command.outputOptions('-map', '0:a');

    command
      .output(output)
      .outputOptions('-map', `[outv${inputs}]`)
      .on('end', () => resolve())
      .on('error', err => reject(err))
      .run();
  });
};
