export type Overlay = {
  text: string;
  start: number;
  end: number;
};

export type OverlayConfig = {
  fontConfig?: FontConfig;
  backgroundConfig?: BackgroundConfig;
  ainmationConfig?: AnimationConfig;
  overlayAlign?:
    | 'topLeft'
    | 'bottomLeft'
    | 'centerLeft'
    | 'topRight'
    | 'bottomRight'
    | 'centerRight'
    | 'topCenter'
    | 'bottomCenter'
    | 'centerCenter';
  overlayMargin?: number;
};

export type FontConfig = {
  path?: string;
  name?: string;
  size?: number;
  color?: string;
  align?: 'center' | 'left' | 'right';
  lineHeight?: number;
};

export type BackgroundConfig = {
  color: string;
  padding: number;
};

export type AnimationConfig = {
  duration: number;
};

export type Bounds = {
  width: number;
  height: number;
};
