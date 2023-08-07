import {
  GroupShape,
  Layer,
  LayerRef,
  Lottie,
  ToingConfig,
  LottieRef,
  Shape,
  ShapeLayer,
  ShapeRef,
  layerTypes,
  shapeTypes,
  ToingUserExecutions,
  ToingCampaign,
} from "../core";
import editsModule from "../edits/editsModule";
import __priv__ from "./privateFields";

//-------------------------------------------------------

export function executeLottieConfigs(
  lottie: Lottie,
  config: ToingConfig,
  userExecutions?: ToingUserExecutions,
  campaign?: ToingCampaign
) {
  //1. config defaults
  config.editEndpoints?.forEach((edit) => {
    const exe = edit.defaults;
    editsModule.execute(lottie, edit, exe);
  });

  //TODO: 2. campaign if exists (overwriting previous step)
  if (campaign) {
    config.editEndpoints?.forEach((edit) => {
      editsModule.execute(lottie, edit, edit.defaults);
    });
  }

  //3. executions if exists (overwriting previous step)
  if (userExecutions && userExecutions.executions) {
    config.editEndpoints?.forEach((edit) => {
      const exe = userExecutions.executions[edit.id];
      if (exe != null) {
        editsModule.execute(lottie, edit, exe);
      }
    });
  }
}

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

export function collectSubShapesTargets(target: Layer | Shape) {
  let allTargets: (Layer | Shape)[] = [];
  function addSubTargets(shape: Layer | Shape) {
    allTargets.push(shape);
    if (shape.ty === shapeTypes.group) {
      (shape as GroupShape).it?.forEach(addSubTargets);
    }
  }
  addSubTargets(target);
  return allTargets;
}
