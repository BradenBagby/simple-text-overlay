import os from 'os';
import { Overlay, OverlayConfig } from './types';
import { getVideoInfo } from './utils';
import { v4 } from 'uuid';
import { join } from 'path';
import { mkdir as mkDirCallback } from 'fs';
import { promisify } from 'util';
import { buildCaption } from './caption-builder';
import ffmpeg from 'fluent-ffmpeg';

const mkdir = promisify(mkDirCallback);

export const addOverlay = async (
  src: string,
  overlays: Overlay[],
  output: string,
  config?: OverlayConfig
): Promise<void> => {
  const { duration, bounds } = await getVideoInfo(src);

  // build each caption
  const tempDir = join(os.tmpdir(), v4());
  await mkdir(tempDir);
  const imageOverlays: ImageOverlay[] = [];
  for (let i = 0; i < overlays.length; i++) {
    const overlay = overlays[i];
    const path = join(tempDir, `${i}.png`);
    imageOverlays.push({ ...overlay, path });
    await buildCaption(overlay.text, bounds, path, config);
  }

  // overlay each caption on the video
  await overlayImagesOnVideo(src, imageOverlays, output);
};

type ImageOverlay = Overlay & { path: string };
const overlayImagesOnVideo = async (
  src: string,
  overlays: ImageOverlay[],
  output: string
) => {
  const bottomPadding = 16; // TODO:

  // Construct the ffmpeg command
  const command = ffmpeg();
  command.input(src);

  // Start building complex filter string
  const filters: string[] = [];
  let last = '[0:v]';
  overlays.forEach((overlay, index) => {
    command.input(overlay.path);
    const next = `[outv${index + 1}]`;
    const x = '(main_w-overlay_w)/2'; // Center x-position
    const y = `main_h-overlay_h-${bottomPadding}`; // 16 pixels from bottom
    filters.push(
      `${last}[${index + 1}:v]overlay=${x}:${y}:enable='between(t,${
        overlay.start
      },${overlay.end})'${next}`
    );
    last = next;
  });

  // Apply complex filter
  const filterString = filters.join(';');
  await new Promise<void>((resolve, reject) => {
    command
      .complexFilter(filterString)
      .outputOptions('-map', '0:a')
      // Output
      .output(output)
      .outputOptions('-map', `[outv${overlays.length}]`)
      .on('end', () => resolve())
      .on('start', command =>
        console.log(`Spawned Ffmpeg with command: ${command as string}`)
      )
      .on('error', err => reject(err))
      .run();
  });
};
