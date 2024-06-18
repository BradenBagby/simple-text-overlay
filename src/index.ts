import { AddOverlayArgs } from './types';
import { getVideoInfo } from './utils';
import os from 'os';

export const addOverlay = async (args: AddOverlayArgs): Promise<void> => {
  const { src, fontFile, overlays } = args;
  const { duration, bounds } = await getVideoInfo(src);

  const tempDir = os.tmpdir();

  // build each overlay
  const test = overlays[0];
};
