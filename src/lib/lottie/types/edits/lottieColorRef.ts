import { Effect, Shape, SolidLayer, TextLayer } from "../lottieJson";

export interface LottieColorRefGroup {
  colorHex: string;
  refs: LottieColorRef[];
}

export type colorRefTypes = "text" | "solid" | "shape" | "effect";

export interface LottieColorRef {
  type: colorRefTypes;
  hex: string;
}

export interface TextColorRef extends LottieColorRef {
  type: "text";
  textColorType: "fill" | "stroke";
  layer: TextLayer;
}

export interface SolidColorRef extends LottieColorRef {
  type: "solid";
  layer: SolidLayer;
}

export interface ShapeColorRef extends LottieColorRef {
  type: "shape";
  shape: Shape;
  shapeColorType: "simple" | "anim" | "simple-grad" | "anim-grad";
  /** for animated color */
  animIdx?: number;

  /** for gradients (gfill and gstroke) */
  gradIdx?: number;
  /** for gradients (gfill and gstroke) */
  gradStopPosition?: number;
}

export interface EffectColorRef extends LottieColorRef {
  type: "effect";
  effect: Effect;
  effectColorType: "simple" | "anim";
  //effectType: effectTypes;

  /** for animated color */
  animIdx?: number;
}
