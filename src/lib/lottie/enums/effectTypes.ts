export enum effectTypes {
  sliderControl = 0,
  angleControl = 1,
  colorControl = 2,
  pointControl = 3,
  checkboxControl = 4,
  group = 5,
  noValue = 6,
  dropDownControl = 7,
  customValue = 9,
  layerIndex = 10,
  maskIndex = 11,
  tint = 20,
  fill = 21,
  stroke = 22,
  tritone = 23,
  proLevels = 24,
  dropShadow = 25,
  radialWipe = 26,
  displacementMap = 27,
  matte3 = 28,
  gaussianBlur2 = 29,
  twirl = 30,
  mesh_warp = 31,
  ripple = 32,
  spherize = 33,
  freePin3 = 3,
}

export function getEffectType(name: string): effectTypes {
  switch (name) {
    case "ADBE Tint":
      return effectTypes.tint;
    case "ADBE Fill":
      return effectTypes.fill;
    case "ADBE Stroke":
      return effectTypes.stroke;
    case "ADBE Tritone":
      return effectTypes.tritone;
    case "ADBE Pro Levels2":
      return effectTypes.proLevels;
    case "ADBE Drop Shadow":
      return effectTypes.dropShadow;
    case "ADBE Radial Wipe":
      return effectTypes.radialWipe;
    case "ADBE Displacement Map":
      return effectTypes.displacementMap;
    case "ADBE Set Matte3":
      return effectTypes.matte3;
    case "ADBE Gaussian Blur 2":
      return effectTypes.gaussianBlur2;
    case "ADBE Twirl":
      return effectTypes.twirl;
    case "ADBE MESH WARP":
      return effectTypes.mesh_warp;
    case "ADBE Ripple":
      return effectTypes.ripple;
    case "ADBE Spherize":
      return effectTypes.spherize;
    case "ADBE FreePin3":
      return effectTypes.freePin3;
    default:
      // bm_eventDispatcher.log(name)
      return effectTypes.group;
  }
}
