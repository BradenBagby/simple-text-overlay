// an overlay is a text that will be displayed on the video
export type Overlay = {
  text: string;
  start: number;
  end?: number;
};

// OverlayAlignOptions is a type that represents the possible positions of an overlay on a video.
export type OverlayAlignOptions =
  | 'topLeft'
  | 'bottomLeft'
  | 'centerLeft'
  | 'topRight'
  | 'bottomRight'
  | 'centerRight'
  | 'topCenter'
  | 'bottomCenter'
  | 'centerCenter';

// OverlayConfig is a type that represents the complete configuration of an overlay.
export type OverlayConfig = {
  audioPath?: string; // optional path of an audio file to add to the video with the text overlay
  fontConfig?: FontConfig; // optional configuration of the font used for the overlay
  backgroundConfig?: BackgroundConfig; // optional configuration of the background of the overlay
  ainmationConfig?: AnimationConfig; // optional configuration of the animation of the overlay
  overlayAlign?: OverlayAlignOptions; // optional position of the overlay on the video
  overlayMargin?: number; // optional margin of the overlay in pixels
};

// FontConfig is a type that represents the configuration of a the font used for the overlay
export type FontConfig = {
  name?: string; // name of the font e.g. Arial
  size?: number; // size of the font in pixels
  color?: string; // color of the font e.g. white
  lineHeight?: number;
  weight?: 'normal' | 'bold' | 'bolder' | 'lighter' | number;
};

// BackgroundConfig is a type that represents the configuration of the background of the overlay
export type BackgroundConfig = {
  color: string; // color of the background e.g. black
  padding: number; // padding of the background in pixels
  borderRadius?: number; // border radius of the background in pixels
};

// AnimationConfig is a type that represents the configuration of the animation of the overlay
export type AnimationConfig = {
  duration: number;
};

export type Bounds = {
  width: number;
  height: number;
};
