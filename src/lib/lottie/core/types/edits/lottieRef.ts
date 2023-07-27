export type refTypes = "layer" | "shape";

interface Ref {
  type: refTypes;
}

export interface LayerRef extends Ref {
  type: "layer";
  layerInd: number;

  /** if the layer is inside an asset, otherwise - it's in the main json layers array */
  assetId?: string;
}

export interface ShapeRef extends Ref {
  type: "shape";
  layerRef: LayerRef;

  /** in the shape-layer shapes array */
  shapeIdx: number;

  /** for nested shapes (groups) */
  subPath?: number[];
}

export type LottieRef = LayerRef | ShapeRef;
