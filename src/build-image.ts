import ffmpeg from 'fluent-ffmpeg';
import * as gm from 'gm';
import { Bounds, OverlayConfig } from './types';
const im = gm.subClass({ imageMagick: 'magick' });

export const buildImage = async (
  text: string,
  config: OverlayConfig,
  bounds: Bounds
): Promise<string> => {
  console.log('called');
  return new Promise((resolve, reject) => {
    resolve('hey');
  });
};

type GetFontSizeArgs = {
  text: string;
  singleFrame: string;
  config: OverlayConfig;
};
export const getTextSize = async ({
  text,
  singleFrame,
  config,
}: GetFontSizeArgs): Promise<Bounds> => {
  const { fontPath, fontSize } = config;
  // a little hackey
  const helper = 83;
  const helper2 = 97;
  const complexFilterString = `drawtext=fontfile=${fontPath}:fontsize=${fontSize}:text='${text}':x='0+0*print(${helper} * tw)':y='0+0*print(${helper2} * th)'`;
  let found = false;
  const bounds = { width: -1, height: -1 };

  const logs: string[] = [];
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(singleFrame)
      .complexFilter(complexFilterString)
      .on('stderr', stderrLine => {
        if (found || typeof stderrLine !== 'string') return;
        if (stderrLine.includes('.')) {
          const number = parseFloat(stderrLine);
          if (!isNaN(number)) {
            const checkWidth = number / helper;
            if (checkWidth % 1 === 0) {
              bounds.width = checkWidth;
              if (bounds.height > 0) {
                found = true;
                resolve(bounds);
              }
            }
            const checkHeight = number / helper2;
            if (checkHeight % 1 === 0) {
              bounds.height = checkHeight;
              if (bounds.width > 0) {
                resolve(bounds);
                found = true;
              }
            }
            logs.push(
              `number: ${number}, checkWidth: ${checkWidth}, checkHeight: ${checkHeight}`
            );
          }
        }
      })
      .outputOptions(['-vframes 1', '-f null'])
      .output('-')
      .on('end', () => {
        if (!found) return reject('could not find text size');
      })
      .on('error', err => {
        reject(err);
      })
      .run();
  });
};
