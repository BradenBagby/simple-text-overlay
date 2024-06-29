import ffmpeg from 'fluent-ffmpeg';
import * as gm from 'gm';
import { Bounds, OverlayConfig } from './types';
import {
  createCanvas,
  loadImage,
  Canvas,
  registerFont,
  CanvasRenderingContext2D,
} from 'canvas';
import { writeFileSync } from 'fs';

export const buildCaption = async (
  text: string,
  config: OverlayConfig,
  bounds: Bounds,
  outputPath: string
): Promise<void> => {
  console.log('called');
  const canvas = createCanvas(bounds.width, bounds.height);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('could not get canvas context');

  ctx.font = `${config.fontSize}px Arial`;
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';

  const maxWidth = bounds.width * 0.8; // Optional: Adjust based on your needs
  const lineHeight = config.fontSize * 1.2;

  const wrapText = (
    context: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    const words = text.split(' ');
    let line = '';
    let yPos = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, yPos);
        line = words[n] + ' ';
        yPos += lineHeight;
      } else {
        line = testLine;
      }
    }

    context.fillText(line, x, yPos);
  };

  wrapText(
    ctx,
    text,
    canvas.width / 2,
    canvas.height / 2,
    maxWidth,
    lineHeight
  );

  const buffer = canvas.toBuffer('image/png');
  writeFileSync(outputPath, buffer);
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
