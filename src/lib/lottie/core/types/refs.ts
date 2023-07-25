import __priv__ from "../../utils/privateFields";
import { Layer, Shape } from "./lottieJson";

export type LayerRef = {
  type: "layer";
  layerInd: number;

  [__priv__]?: {
    target?: Layer;
  };
};

export type ShapeRef = {
  type: "shape";
  layerInd: number;
  shapeIdx: number;
  subPath?: number[];

  [__priv__]?: {
    target?: Shape;
  };
};

export type LottieRef = LayerRef | ShapeRef;
