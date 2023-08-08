import BuilderPrecompLayer from "../components/layers/BuilderPrecompLayer";
import BuilderUnknownLayer from "../components/layers/BuilderUnknownLayer";
import BuilderShapeLayer from "../components/layers/builderShapeLayer";
import BuilderSolidLayer from "../components/layers/builderSolidLayer";
import BuilderTextLayer from "../components/layers/builderTextLayer";
import { layerTypes } from "../enums";
import ComponentsRegistry from "../helpers/componentsRegistry";
import { Layer } from "../types";

//-------------------------------------------------------
// register all layer components
//-------------------------------------------------------
const layers = new ComponentsRegistry<layerTypes, LayerProps>();
layers.registerDefault(BuilderUnknownLayer);
layers.register(layerTypes.text, BuilderTextLayer);
layers.register(layerTypes.shape, BuilderShapeLayer);
layers.register(layerTypes.precomp, BuilderPrecompLayer);
layers.register(layerTypes.solid, BuilderSolidLayer);

//-------------------------------------------------------
export type LayerProps<T extends Layer = Layer> = {
  layer: T;
};

//-------------------------------------------------------

export const lottieLayersUiModule = {
  layers,
};

export default lottieLayersUiModule;
