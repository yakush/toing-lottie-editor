import {
  GroupShape,
  Layer,
  LayerRef,
  Lottie,
  LottieRef,
  ShapeLayer,
  ShapeRef,
  layerTypes,
  shapeTypes,
} from "../core";

//-------------------------------------------------------

export function findLayerRef(lottie: Lottie, ref: LayerRef) {
  if (ref.type !== "layer") {
    return;
  }

  let layers: Layer[] | undefined;
  layers = lottie.layers;
  if (!!ref.assetId) {
    layers = lottie.assets?.find((asset) => asset.id === ref.assetId)?.layers;
  }

  return layers?.find((layer) => layer.ind === ref.layerInd);
}

//-------------------------------------------------------

export function findShapeRef(lottie: Lottie, ref: ShapeRef) {
  if (ref.type !== "shape") {
    return;
  }

  const layer = findLayerRef(lottie, ref.layerRef) as ShapeLayer;
  if (layer == null) {
    return;
  }

  if (layer.ty !== layerTypes.shape) {
    return;
  }

  let shape = layer.shapes ? layer.shapes[ref.shapeIdx] : undefined;

  //sub shape in groups
  if (ref.subPath?.length) {
    for (let i = 0; i < ref.subPath.length; i++) {
      if (shape?.ty !== shapeTypes.group) {
        return;
      }

      const idx = ref.subPath[i];
      const group = shape as GroupShape | undefined;
      shape = group?.it ? group?.it[idx] : undefined;
    }
  }

  return shape;
}

//-------------------------------------------------------

export function findLottieRef(lottie: Lottie, ref: LottieRef) {
  switch (ref.type) {
    case "layer":
      return findLayerRef(lottie, ref);

    case "shape":
      return findShapeRef(lottie, ref);

    default:
      return undefined;
  }
}
