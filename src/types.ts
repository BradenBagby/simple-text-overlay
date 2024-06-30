export type Overlay = {
  text: string;
  start: number;
  end: number;
  audio?: string;
};

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

export type OverlayConfig = {
  fontConfig?: FontConfig;
  backgroundConfig?: BackgroundConfig;
  ainmationConfig?: AnimationConfig;
  overlayAlign?: OverlayAlignOptions;
  overlayMargin?: number;
};

export type FontConfig = {
  name?: string;
  size?: number;
  color?: string;
  lineHeight?: number;
  weight?: 'normal' | 'bold' | 'bolder' | 'lighter' | number;
};

export type BackgroundConfig = {
  color: string;
  padding: number;
  borderRadius?: number;
};

export type AnimationConfig = {
  duration: number;
};

export type Bounds = {
  width: number;
  height: number;
};
