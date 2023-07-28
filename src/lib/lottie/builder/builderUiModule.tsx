import { Layer, layerTypes } from "../core";
import ComponentRegistry from "../utils/componentRegistryClass";
import BuilderPrecompLayer from "./components/layers/BuilderPrecompLayer";
import BuilderShapeLayer from "./components/layers/builderShapeLayer";
import BuilderSolidLayer from "./components/layers/builderSolidLayer";

import BuilderTextLayer from "./components/layers/builderTextLayer";
import BuilderUnknownLayer from "./components/layers/BuilderUnknownLayer";

export type LayerProps<T extends Layer = Layer> = {
  layer: T;
};

export type EditBuilderProps<T extends {} = {}> = {
  type: string;
  data: T;
};

export interface ModuleType {
  layers: ComponentRegistry<layerTypes, LayerProps>;
  editBuilders: ComponentRegistry<string, EditBuilderProps>;
}

//-------------------------------------------------------
// register all layers components
//-------------------------------------------------------
const layers = new ComponentRegistry<layerTypes, LayerProps>();
layers.registerUnknown(BuilderUnknownLayer);
layers.register(layerTypes.text, BuilderTextLayer);
layers.register(layerTypes.shape, BuilderShapeLayer);
layers.register(layerTypes.precomp, BuilderPrecompLayer);
layers.register(layerTypes.solid, BuilderSolidLayer);

//-------------------------------------------------------
// register all edit-builder components
//-------------------------------------------------------
const editBuilders = new ComponentRegistry<string, EditBuilderProps>();
//edits.register("color", TextLayerUI);
//edits.register("layerSelect".shape, ShapeLayerUI);

export const builderUiModule: ModuleType = {
  layers,
  editBuilders,
};

export default builderUiModule;
