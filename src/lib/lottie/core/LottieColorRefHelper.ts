import { effectTypes, layerTypes, shapeTypes } from "../enums";
import {
  Effect,
  EffectColorRef,
  GroupShape,
  Layer,
  Lottie,
  LottieAnimColor,
  LottieColor,
  LottieColorRef,
  LottieColorRefGroup,
  LottieSimpleColor,
  PrecompLayer,
  Shape,
  ShapeColorRef,
  ShapeLayer,
  SolidColorRef,
  SolidLayer,
  TextColorRef,
  TextLayer,
} from "../types";
import { LottieColorHelper } from "./LottieColorHelper";

const __priv__ = Symbol("privateFields");
type WithRef = {
  [__priv__]?: {
    colorRefs: LottieColorRefGroup[];
  };
};

export const LottieColorRefHelper = {
  createColorGroups,
  deleteColorGroups,
  getColorGroups,
  setLottieColor,
};

//-------------------------------------------------------
//-------------------------------------------------------
// color refs

function getColorGroups(lottie?: Lottie & WithRef) {
  return lottie?.[__priv__]?.colorRefs ?? [];
}

function createColorGroups(lottie: Lottie & WithRef) {
  deleteColorGroups(lottie);

  const colorRefs = getColorRefs(lottie);
  const groups = groupColorsRefs(colorRefs);
  lottie[__priv__] = {
    colorRefs: groups,
  };
}

function deleteColorGroups(lottie: Lottie & WithRef) {
  delete lottie[__priv__];
}

function groupColorsRefs(colorsRefs: LottieColorRef[]) {
  const groups: LottieColorRefGroup[] = [];

  colorsRefs.forEach((colorRef) => {
    const colorHex = colorRef.hex;
    let group = groups.find((g) =>
      LottieColorHelper.compareColorsHex(g.colorHex, colorHex)
    );
    if (!group) {
      group = {
        colorHex: colorHex,
        refs: [],
      };
      groups.push(group);
    }
    group.refs.push(colorRef);
  });

  return groups;
}

function setLottieColor(refs: LottieColorRef[] | undefined, colorHex?: string) {
  refs?.forEach((ref) => {
    if (ref.type === "solid") {
      const solidRef = ref as SolidColorRef;
      solidRef.layer.sc = colorHex;
    }

    if (ref.type === "text") {
      const textColorRef = ref as TextColorRef;
      const target = textColorRef.layer.t?.d?.k?.at(0)?.s;
      if (textColorRef.textColorType === "fill") {
        target && (target.fc = LottieColorHelper.hexToRgb(colorHex));
      } else if (textColorRef.textColorType === "stroke") {
        target && (target.sc = LottieColorHelper.hexToRgb(colorHex));
      }
    }

    if (ref.type === "shape") {
      const shapeColorRef = ref as ShapeColorRef;
      const { shape, shapeColorType, animIdx, gradIdx, gradStopPosition } =
        shapeColorRef;

      if (!shape.c) {
        console.warn("no shape color found");
        return;
      }

      switch (shapeColorType) {
        case "simple": {
          const simpleColor = shape.c as LottieSimpleColor;
          simpleColor.k = LottieColorHelper.hexToRgb(colorHex);
          break;
        }
        case "anim": {
          const animColor = shape.c as LottieAnimColor;
          if (animIdx == null) {
            console.warn("animIdx not defined");
            return;
          }
          const target = animColor?.k?.at(animIdx);
          if (target != null) {
            target.s = LottieColorHelper.hexToRgb(colorHex);
          }
          break;
        }
        case "simple-grad": {
          const simpleColor = shape.c as LottieSimpleColor;

          if (gradIdx == null) {
            console.warn("gradIdx not defined");
            return;
          }

          if (gradStopPosition == null) {
            console.warn("gradStopPosition not defined");
            return;
          }

          const gradStopColor = LottieColorHelper.hexToRgb(colorHex);
          gradStopColor.length = 3; //remove alpha

          simpleColor.k[gradIdx * 4 + 0] = gradStopPosition;
          simpleColor.k[gradIdx * 4 + 1] = gradStopColor[0];
          simpleColor.k[gradIdx * 4 + 2] = gradStopColor[1];
          simpleColor.k[gradIdx * 4 + 3] = gradStopColor[2];
          break;
        }
        case "anim-grad": {
          const animColor = shape.c as LottieAnimColor;

          if (animIdx == null) {
            console.warn("animIdx not defined");
            return;
          }
          if (gradIdx == null) {
            console.warn("gradIdx not defined");
            return;
          }
          if (gradStopPosition == null) {
            console.warn("gradStopPosition not defined");
            return;
          }

          const gradStopColor = LottieColorHelper.hexToRgb(colorHex);
          gradStopColor.length = 3; //remove alpha

          const target = animColor?.k?.at(animIdx)?.s;
          if (target != null) {
            target[gradIdx * 4 + 0] = gradStopPosition;
            target[gradIdx * 4 + 1] = gradStopColor[0];
            target[gradIdx * 4 + 2] = gradStopColor[1];
            target[gradIdx * 4 + 3] = gradStopColor[2];
          }
          break;
        }
      }
    }
    if (ref.type === "effect") {
      const effectRef = ref as EffectColorRef;
      const { effect, effectColorType, animIdx } = effectRef;
      switch (effectColorType) {
        case "simple": {
          const simpleColor = effect.v as LottieSimpleColor | undefined;
          if (simpleColor) {
            simpleColor.k = LottieColorHelper.hexToRgb(colorHex);
          }
          break;
        }
        case "anim": {
          const animColor = effect.v as LottieAnimColor | undefined;
          if (animIdx == null) {
            console.warn("animIdx not defined");
            return;
          }
          const target = animColor?.k?.at(animIdx);
          if (target != null) {
            target.s = LottieColorHelper.hexToRgb(colorHex);
          }
          break;
        }
      }
    }
  });
}

function getColorRefs(
  json: Lottie | undefined,
  colorHex?: string
): LottieColorRef[] {
  const refs: LottieColorRef[] = [];

  if (!json) {
    return refs;
  }

  json.layers?.forEach((layer) => {
    refs.push(...getLayerColorRefs(json, layer, colorHex));
  });

  return refs;
}

//-------------------------------------------------------

function getLayerColorRefs(
  json: Lottie,
  layer: Layer,
  colorHex?: string
): LottieColorRef[] {
  const refs: LottieColorRef[] = [];

  const layerType = layer.ty;

  switch (layerType) {
    case layerTypes.precomp: {
      const asset = json.assets?.find(
        (asset) => asset.id === (layer as PrecompLayer).refId
      );
      if (asset?.layers) {
        asset.layers?.forEach((layer) => {
          refs.push(...getLayerColorRefs(json, layer, colorHex));
        });
      }
      break;
    }
    case layerTypes.solid: {
      refs.push(...getSolidLayerColorRefs(layer, colorHex));
      break;
    }
    case layerTypes.text: {
      refs.push(...getTextLayerColorRefs(layer, colorHex));
      break;
    }
    case layerTypes.shape: {
      refs.push(...getShapeLayerColorRefs(layer, colorHex));
      break;
    }
  }

  //effects:
  layer.ef?.forEach((effect) => {
    refs.push(...getEffectColorRefs(effect, colorHex));
  });

  return refs;
}
//-------------------------------------------------------

function getEffectColorRefs(
  effect: Effect,
  colorHex?: string
): LottieColorRef[] {
  const refs: LottieColorRef[] = [];

  const shouldGetAllColors = colorHex == null;

  const { ty } = effect;

  switch (ty) {
    case effectTypes.colorControl: {
      const color = effect.v as LottieColor;
      if (!color) {
        return refs;
      }

      if (LottieColorHelper.isSimpleColor(color)) {
        //simple
        const simpleColor = color as LottieSimpleColor;
        const effectColorHex = LottieColorHelper.rgbToHex(simpleColor.k);
        if (
          shouldGetAllColors ||
          LottieColorHelper.compareColorsHex(effectColorHex, colorHex)
        ) {
          const ref: EffectColorRef = {
            type: "effect",
            effectColorType: "simple",
            effect,
            hex: LottieColorHelper.normalizeHexString(effectColorHex),
          };
          refs.push(ref);
        }
      } else {
        //anim
        const animColor = color as LottieAnimColor;
        animColor.k.forEach((keyframe, i) => {
          const keyframeColorArr = keyframe.s;
          const keyframeColorHex = LottieColorHelper.rgbToHex(keyframeColorArr);
          if (
            shouldGetAllColors ||
            LottieColorHelper.compareColorsHex(keyframeColorHex, colorHex)
          ) {
            const ref: EffectColorRef = {
              type: "effect",
              effectColorType: "anim",
              effect,
              hex: LottieColorHelper.normalizeHexString(keyframeColorHex),
              animIdx: i,
            };
            refs.push(ref);
          }
        });
      }
      break;
    }
  }

  //sub effects:
  effect.ef?.forEach((effect) => {
    refs.push(...getEffectColorRefs(effect, colorHex));
  });

  return refs;
}

//-------------------------------------------------------

function getSolidLayerColorRefs(
  layer: SolidLayer,
  colorHex?: string
): LottieColorRef[] {
  const refs: LottieColorRef[] = [];

  const layerColor = layer.sc;

  const shouldGetAllColors = colorHex == null;
  if (
    shouldGetAllColors ||
    LottieColorHelper.compareColorsHex(layerColor, colorHex)
  ) {
    const ref: SolidColorRef = {
      type: "solid",
      hex: LottieColorHelper.normalizeHexString(layerColor),
      layer,
    };
    refs.push(ref);
  }
  return refs;
}

//-------------------------------------------------------

function getTextLayerColorRefs(
  layer: TextLayer,
  colorHex?: string
): LottieColorRef[] {
  const refs: LottieColorRef[] = [];

  const textNode = layer?.t?.d?.k?.at(0)?.s;

  const fillColor = textNode?.fc && LottieColorHelper.rgbToHex(textNode?.fc);
  const strokeColor = textNode?.sc && LottieColorHelper.rgbToHex(textNode?.sc);

  const shouldGetAllColors = colorHex == null;

  //fill
  if (fillColor != null) {
    if (
      shouldGetAllColors ||
      LottieColorHelper.compareColorsHex(fillColor, colorHex)
    ) {
      const ref: TextColorRef = {
        type: "text",
        textColorType: "fill",
        hex: LottieColorHelper.normalizeHexString(fillColor),
        layer,
      };
      refs.push(ref);
    }
  }

  //stroke
  if (strokeColor != null) {
    if (
      shouldGetAllColors ||
      LottieColorHelper.compareColorsHex(strokeColor, colorHex)
    ) {
      const ref: TextColorRef = {
        type: "text",
        textColorType: "stroke",
        hex: LottieColorHelper.normalizeHexString(strokeColor),
        layer,
      };
      refs.push(ref);
    }
  }

  return refs;
}

function getShapeLayerColorRefs(
  layer: ShapeLayer,
  colorHex?: string
): LottieColorRef[] {
  const refs: LottieColorRef[] = [];
  const shapes: Shape[] = layer.shapes || [];

  shapes.forEach((shape) => {
    refs.push(...getShapeColorRefs(shape, colorHex));
  });
  return refs;
}

//-------------------------------------------------------

function getShapeColorRefs(shape: Shape, colorHex?: string): LottieColorRef[] {
  const shouldGetAllColors = colorHex == null;

  const refs: LottieColorRef[] = [];
  const type = shape.ty;

  switch (type) {
    case shapeTypes.group: {
      const group = shape as GroupShape;

      const items: Shape[] = group.it || [];
      items.forEach((shape) => {
        refs.push(...getShapeColorRefs(shape, colorHex));
      });
      break;
    }

    case shapeTypes.fill:
    case shapeTypes.stroke: {
      const color = shape.c;
      if (!color) {
        return refs;
      }

      if (LottieColorHelper.isSimpleColor(color)) {
        //simple
        const simpleColor = color as LottieSimpleColor;
        const shapeColorHex = LottieColorHelper.rgbToHex(simpleColor.k);
        if (
          shouldGetAllColors ||
          LottieColorHelper.compareColorsHex(shapeColorHex, colorHex)
        ) {
          const ref: ShapeColorRef = {
            type: "shape",
            shapeColorType: "simple",
            shape,
            hex: LottieColorHelper.normalizeHexString(shapeColorHex),
          };
          refs.push(ref);
        }
      } else {
        //anim
        const animColor = color as LottieAnimColor;
        animColor.k.forEach((keyframe, i) => {
          const keyframeColorArr = keyframe.s;
          const keyframeColorHex = LottieColorHelper.rgbToHex(keyframeColorArr);
          if (
            shouldGetAllColors ||
            LottieColorHelper.compareColorsHex(keyframeColorHex, colorHex)
          ) {
            const ref: ShapeColorRef = {
              type: "shape",
              shapeColorType: "anim",
              shape,
              hex: LottieColorHelper.normalizeHexString(keyframeColorHex),
              animIdx: i,
            };
            refs.push(ref);
          }
        });
      }
      break;
    }
    case shapeTypes.gfill:
    case shapeTypes.gStroke: {
      const color = shape.g?.k;
      if (!color) {
        return refs;
      }

      if (LottieColorHelper.isSimpleColor(color)) {
        //simple grad
        const simpleColor = color as LottieSimpleColor;
        const numColors = simpleColor.k.length / 4;
        for (let gradIdx = 0; gradIdx < numColors; gradIdx++) {
          const pos = simpleColor.k[gradIdx * 4 + 0];
          const r = simpleColor.k[gradIdx * 4 + 1];
          const g = simpleColor.k[gradIdx * 4 + 2];
          const b = simpleColor.k[gradIdx * 4 + 3];

          const gradStopColorArr = [r, g, b];
          const gradStopColorHex = LottieColorHelper.rgbToHex(gradStopColorArr);

          if (
            shouldGetAllColors ||
            LottieColorHelper.compareColorsHex(gradStopColorHex, colorHex)
          ) {
            const ref: ShapeColorRef = {
              type: "shape",
              shapeColorType: "simple-grad",
              shape,
              hex: LottieColorHelper.normalizeHexString(gradStopColorHex),
              gradStopPosition: pos,
              gradIdx: gradIdx,
            };
            refs.push(ref);
          }
        }
      } else {
        //anim grad
        const animColor = color as LottieAnimColor;
        animColor.k.forEach((keyframe, animIdx) => {
          const numColors = keyframe.s.length / 4;
          for (let gradIdx = 0; gradIdx < numColors; gradIdx++) {
            const pos = keyframe.s[gradIdx * 4 + 0];
            const r = keyframe.s[gradIdx * 4 + 1];
            const g = keyframe.s[gradIdx * 4 + 2];
            const b = keyframe.s[gradIdx * 4 + 3];

            const gradStopColorArr = [r, g, b];
            const gradStopColorHex =
              LottieColorHelper.rgbToHex(gradStopColorArr);

            if (
              shouldGetAllColors ||
              LottieColorHelper.compareColorsHex(gradStopColorHex, colorHex)
            ) {
              const ref: ShapeColorRef = {
                type: "shape",
                shapeColorType: "anim-grad",
                shape,
                hex: LottieColorHelper.normalizeHexString(gradStopColorHex),
                animIdx: animIdx,
                gradStopPosition: pos,
                gradIdx: gradIdx,
              };
              refs.push(ref);
            }
          }
        });
      }
      break;
    }
  }

  return refs;
}
