export * from './types';
import { mkdir as mkDirCallback } from 'fs';
import os from 'os';
import { join } from 'path';
import { promisify } from 'util';
import { v4 } from 'uuid';
import { buildCaption } from './caption-builder';
import { Overlay, OverlayConfig } from './types';
import { getVideoInfo } from './utils';
import { ImageOverlay, overlayImagesOnVideo } from './overlay';

const mkdir = promisify(mkDirCallback);

export const addOverlay = async (
  src: string,
  overlays: Overlay[],
  output: string,
  config?: OverlayConfig
): Promise<void> => {
  const { bounds } = await getVideoInfo(src);

  // build each caption
  const tempDir = join(os.tmpdir(), v4());
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
