export * from './types';
import { mkdir as mkDirCallback } from 'fs';
import os from 'os';
import { join } from 'path';
import { promisify } from 'util';
import { buildCaption } from './caption-builder';
import { ImageOverlay, overlayImagesOnVideo } from './overlay';
import { Overlay, OverlayConfig } from './types';
import { getVideoInfo, randomHash } from './utils';
export { buildCaption } from './caption-builder';
export { getVideoInfo } from './utils';

const mkdir = promisify(mkDirCallback);

export const addOverlay = async (
  src: string,
  overlays: Overlay[],
  output: string,
  config?: OverlayConfig
): Promise<void> => {
  const { bounds, duration } = await getVideoInfo(src);

  // fill in end for each overlay if needed
  overlays.forEach((overlay, i) => {
    if (overlay.end !== undefined) return overlay;
    const nextOverlay = overlays[i + 1];
    if (nextOverlay) overlay.end = nextOverlay.start;
    else overlay.end = duration;
  });

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
