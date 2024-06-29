import os from 'os';
import { Overlay, OverlayConfig } from './types';
import { getVideoInfo } from './utils';

export const addOverlay = async (
  src: string,
  overlays: Overlay[],
  config?: OverlayConfig
): Promise<void> => {
  const { duration, bounds } = await getVideoInfo(src);

  const tempDir = os.tmpdir();

  // build each overlay
  const test = overlays[0];
};
