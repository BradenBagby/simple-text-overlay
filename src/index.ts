import os from 'os';
import { Overlay, OverlayConfig } from './types';
import { getVideoInfo } from './utils';
import { v4 } from 'uuid';
import { join } from 'path';
import { mkdir as mkDirCallback } from 'fs';
import { promisify } from 'util';
import { buildCaption } from './caption-builder';

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
  const paths: string[] = [];
  for (let i = 0; i < overlays.length; i++) {
    const path = join(tempDir, `${i}.png`);
    paths.push(path);
    await buildCaption(overlays[i].text, bounds, path, config);
  }

  // overlay each caption on the video
};
