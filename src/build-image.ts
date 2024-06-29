import { CanvasRenderingContext2D, createCanvas } from 'canvas';
import ffmpeg from 'fluent-ffmpeg';
import { writeFileSync } from 'fs';
import { Bounds, OverlayConfig } from './types';

export const buildCaption = async (
  text: string,
  config: OverlayConfig,
  bounds: Bounds,
  outputPath: string
): Promise<void> => {
  const canvas = createCanvas(bounds.width, bounds.height);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('could not get canvas context');

  const setContext = () => {
    ctx.font = `${config.fontSize}px Arial`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
  };
  setContext();

  // calcluate
  const padding = 16;
  const p2 = padding * 2;
  const maxWidth = bounds.width - p2; // TODO: padding
  const lineHeight = config.fontSize * 1;
  const lines = getLines(ctx, text, maxWidth);
  const totalTextHeight = lines.length * lineHeight;
  const height = totalTextHeight + p2;
  console.log('lines', lines);
  if (height > bounds.height) throw new Error('text too long to fit in bounds');
  canvas.height = height;
  setContext();

  console.log({ totalTextHeight, height });

  // draw
  let yPos = lineHeight + padding;
  for (let i = 0; i < lines.length; i++) {
    console.log(yPos);
    const line = lines[i];
    ctx.fillText(line.text, bounds.width / 2, yPos);
    yPos += lineHeight;
  }

  const buffer = canvas.toBuffer('image/png');
  writeFileSync(outputPath, buffer);
};

/**
 * Split caption into lines that will fit into max width
 */
type Line = {
  text: string;
  width: number;
};
const getLines = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): Line[] => {
  // take text, return Line with width and height
  const calc = (line: string) => {
    const metrics = ctx.measureText(line);
    return { text: line, width: metrics.width };
  };

  const words = text.split(' ');
  let line = '';
  const lines: Line[] = [];

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      lines.push(calc(line));
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }

  if (line.length) lines.push(calc(line.trim()));

  return lines;
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
