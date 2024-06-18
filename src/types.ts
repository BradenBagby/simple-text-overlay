export type AddOverlayArgs = {
  overlays: Overlay[];
  src: string;
  fontFile: string;
};
export type Overlay = {
  text: string;
  start: number;
  end: number;
};

export type OverlayConfig = {
  fontPath: string;
  fontSize: number;
  // TODO: background and stuff
};

export type Bounds = {
  width: number;
  height: number;
};
