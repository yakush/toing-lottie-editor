import {
  GroupShape,
  Layer,
  LayerRef,
  Lottie,
  LottieEdits,
  LottieRef,
  Shape,
  ShapeLayer,
  ShapeRef,
  layerTypes,
  shapeTypes,
} from "../core";
import __priv__ from "./privateFields";

//-------------------------------------------------------

export function findLayerRef(lottie?: Lottie, ref?: LayerRef) {
  if (!lottie) {
    return;
  }

  if (!ref) {
    return;
  }

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

export function findShapeRef(lottie?: Lottie, ref?: ShapeRef) {
  if (!lottie) {
    return;
  }

  if (!ref) {
    return;
  }

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

export function findLottieRef(lottie?: Lottie, ref?: LottieRef) {
  if (!lottie) {
    return;
  }

  if (!ref) {
    return;
  }

  switch (ref.type) {
    case "layer":
      return findLayerRef(lottie, ref);

    case "shape":
      return findShapeRef(lottie, ref);

    default:
      return undefined;
  }
}

//-------------------------------------------------------
type WithRef = {
  [__priv__]?: {
    ref?: LottieRef;
  };
};

export function getLottieRef(target: Layer | Shape) {
  const targetWithRef: (Layer | Shape) & WithRef = target;
  return targetWithRef[__priv__]?.ref;
}

export function createLottieRefs(lottie: Lottie) {
  //layers:
  lottie.layers?.forEach((layer) => createLayerRef(layer));

  //assets
  lottie.assets?.forEach((asset) => {
    asset.layers?.forEach((layer) => createLayerRef(layer, asset.id));
  });
}

function createLayerRef(layer: Layer & WithRef, assetId?: string) {
  let priv = layer[__priv__];
  if (!priv) {
    priv = layer[__priv__] = {};
  }
  const ref: LayerRef = {
    type: "layer",
    layerInd: layer.ind,
    assetId: assetId,
  };

  priv.ref = ref;

  //shapes:
  if (layer.ty === layerTypes.shape) {
    (layer as ShapeLayer).shapes?.forEach((shape, i) => {
      createShapeRef(ref, shape, i);
    });
  }
}

function createShapeRef(
  layerRef: LayerRef,
  shape: Shape & WithRef,
  shapeIdx: number,
  subPath: number[] = []
) {
  let priv = shape[__priv__];
  if (!priv) {
    priv = shape[__priv__] = {};
  }

  const ref: ShapeRef = {
    type: "shape",
    layerRef: { ...layerRef },
    shapeIdx,
    subPath,
  };

  priv.ref = ref;

  //sub shapes in group:
  if (shape.ty === shapeTypes.group) {
    (shape as GroupShape).it?.forEach((subShape, i) => {
      createShapeRef(layerRef, subShape, shapeIdx, [...subPath, i]);
    });
  }
}

//-------------------------------------------------------

/**
 * removes all executions fields from all the edits. (for example: exporting a clean edits json)
 * @param edits original edits
 * @returns purged copy of edits
 */
export function purgeEditsExecutions(edits: LottieEdits) {
  let purged = { ...edits };
  purged.edits = purged.edits?.map((item) => ({
    ...item,
    execution: undefined,
  }));
  return purged;
}
