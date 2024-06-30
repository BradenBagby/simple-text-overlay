import { Canvas, CanvasRenderingContext2D, createCanvas } from 'canvas';
import { writeFile as writeFileCallback } from 'fs';
import { BackgroundConfig, Bounds, OverlayConfig } from './types';
import { promisify } from 'util';
import { DEFAULT_FONT_CONFOG } from './constants';
const writeFile = promisify(writeFileCallback);

/**
 * Builds a caption image from given text and config
 */
export const buildCaption = async (
  text: string,
  bounds: Bounds,
  outputPath: string,
  config?: OverlayConfig
): Promise<{ width: number; height: number }> => {
  let canvas = createCanvas(bounds.width, bounds.height);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('could not get canvas context');
  const { fontConfig, backgroundConfig } = config || {};

  // defaults
  const fontName = fontConfig?.name || DEFAULT_FONT_CONFOG.name;
  const fontSize = fontConfig?.size || DEFAULT_FONT_CONFOG.size;
  const fontColor = fontConfig?.color || DEFAULT_FONT_CONFOG.color;
  const fontLineHeight =
    fontConfig?.lineHeight || DEFAULT_FONT_CONFOG.lineHeight;
  const padding = backgroundConfig?.padding || 0;

  const setContextFromConfig = () => {
    ctx.font = `${fontSize}px ${fontName}`;
    ctx.fillStyle = fontColor;
    ctx.textAlign = 'center';
  };
  setContextFromConfig();

  // calcluate
  const p2 = padding * 2;
  const maxWidth = bounds.width - p2;
  const lines = getLines(ctx, text, maxWidth);
  const lineHeight = fontLineHeight * fontSize;
  const totalTextHeight = lines.length * lineHeight;
  const height = totalTextHeight + p2;
  if (height > bounds.height) throw new Error('text too long to fit in bounds');
  canvas.height = height + lineHeight; // add extra line for letters that hang below the line
  setContextFromConfig();

  // draw
  let yPos = lineHeight + padding;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    ctx.fillText(line.text, bounds.width / 2, yPos);
    yPos += lineHeight;
  }

  // crop
  canvas = cropToContent(canvas);

  // add background
  if (backgroundConfig) canvas = addBackground(canvas, backgroundConfig);

  // write to file
  const buffer = canvas.toBuffer('image/png');
  await writeFile(outputPath, buffer);

  return {
    width: canvas.width,
    height: canvas.height,
  };
};

const addBackground = (canvas: Canvas, config: BackgroundConfig): Canvas => {
  const { padding, color, borderRadius } = config;
  const originalWidth = canvas.width;
  const originalHeight = canvas.height;

  const newWidth = originalWidth + 2 * padding;
  const newHeight = originalHeight + 2 * padding;

  // Create a new canvas with increased dimensions
  const newCanvas = createCanvas(newWidth, newHeight);
  const context = newCanvas.getContext('2d');

  // Function to draw a rounded rectangle
  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.arcTo(width, 0, width, height, radius);
    ctx.arcTo(width, height, 0, height, radius);
    ctx.arcTo(0, height, 0, 0, radius);
    ctx.arcTo(0, 0, width, 0, radius);
    ctx.closePath();
  };

  // Fill the background with the specified color and border radius
  context.fillStyle = color;
  drawRoundedRect(context, newWidth, newHeight, borderRadius || 0);
  context.fill();

  // Draw the original canvas onto the new canvas with padding
  context.drawImage(canvas, padding, padding);

  return newCanvas;
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

/**
 * Crop context to its content
 */
const cropToContent = (canvas: Canvas): Canvas => {
  // Get the dimensions of the original canvas
  const { width: originalWidth, height: originalHeight } = canvas;
  const context = canvas.getContext('2d');

  // Find the bounding box of non-transparent content
  let minX = originalWidth;
  let minY = originalHeight;
  let maxX = -1;
  let maxY = -1;

  // Get the image data of the entire canvas
  const imageData = context.getImageData(0, 0, originalWidth, originalHeight);
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
    canvas,
    minX,
    minY,
    boundingBoxWidth,
    boundingBoxHeight,
    0,
    0,
    boundingBoxWidth,
    boundingBoxHeight
  );

  return croppedCtx.canvas;
};
