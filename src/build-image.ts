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

  // draw
  let yPos = lineHeight + padding;
  for (let i = 0; i < lines.length; i++) {
    console.log(yPos);
    const line = lines[i];
    ctx.fillText(line.text, bounds.width / 2, yPos);
    yPos += lineHeight;
  }

  const croppedContext = cropToContent(ctx);
  const buffer = croppedContext.canvas.toBuffer('image/png');
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

const cropToContent = (
  originalCtx: CanvasRenderingContext2D
): CanvasRenderingContext2D => {
  // Get the dimensions of the original canvas
  const { width: originalWidth, height: originalHeight } = originalCtx.canvas;

  // Find the bounding box of non-transparent content
  let minX = originalWidth;
  let minY = originalHeight;
  let maxX = -1;
  let maxY = -1;

  // Get the image data of the entire canvas
  const imageData = originalCtx.getImageData(
    0,
    0,
    originalWidth,
    originalHeight
  );
  const { data, width, height } = imageData;

  // Iterate over all pixels to find the bounding box of non-transparent content
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const alpha = data[index + 3];

      if (alpha > 0) {
        // Found non-transparent pixel
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // Calculate dimensions of the bounding box
  const boundingBoxWidth = maxX - minX + 1;
  const boundingBoxHeight = maxY - minY + 1;

  // Create a new canvas for the cropped image
  const croppedCanvas = createCanvas(boundingBoxWidth, boundingBoxHeight);
  const croppedCtx = croppedCanvas.getContext('2d');

  // Draw the cropped region onto the new canvas
  croppedCtx.drawImage(
    originalCtx.canvas,
    minX,
    minY,
    boundingBoxWidth,
    boundingBoxHeight,
    0,
    0,
    boundingBoxWidth,
    boundingBoxHeight
  );

  return croppedCtx;
};
