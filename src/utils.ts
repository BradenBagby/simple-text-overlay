import ffmpeg, { FfprobeData } from 'fluent-ffmpeg';
import { promisify } from 'util';
import { Bounds } from './types';
const ffprobe = promisify(ffmpeg.ffprobe);

/**
 * Get the duration, width and height of a video file
 */
export const getVideoInfo = async (
  src: string
): Promise<{ duration: number; bounds: Bounds }> => {
  const probeResult = (await ffprobe(src)) as FfprobeData;
  const stream = probeResult.streams.find(s => s.codec_type === 'video');
  if (!stream) throw new Error('No video stream found in the video');
  const duration = probeResult.format.duration;
  const { width, height } = stream;
  if (!duration) throw new Error('No duration found for video');
  if (!width) throw new Error('No width found for video');
  if (!height) throw new Error('No height found for video');
  return { duration, bounds: { width, height } };
};

export const getSingleFrame = (src: string, output: string) =>
  new Promise<void>((resolve, reject) => {
    ffmpeg(src)
      .outputOptions('-vf', 'select=eq(n\\,0)', '-vsync', 'vfr')
      .output(output)
      .on('end', () => {
        resolve();
      })
      .on('error', err => {
        reject(err);
      })
      .run();
  });
