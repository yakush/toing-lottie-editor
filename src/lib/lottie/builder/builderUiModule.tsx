import { EditData, editTypes, Layer, layerTypes } from "../core";
import ComponentRegistry from "../utils/componentRegistryClass";
import TextEditBuilderView from "./components/editsBuilders/TextEditBuilderView";
import BuilderPrecompLayer from "./components/layers/BuilderPrecompLayer";
import BuilderShapeLayer from "./components/layers/builderShapeLayer";
import BuilderSolidLayer from "./components/layers/builderSolidLayer";

import BuilderTextLayer from "./components/layers/builderTextLayer";
import BuilderUnknownLayer from "./components/layers/BuilderUnknownLayer";

export type LayerProps<T extends Layer = Layer> = {
  layer: T;
};
export type EditProps<
  T_CONFIG extends {} = any,
  T_EXECUTION extends {} = any
> = {
  edit: EditData<T_CONFIG, T_EXECUTION>;
  onEditChanged?: (edit: EditData<T_CONFIG, T_EXECUTION>) => void;
};

export type EditBuilderProps<
  T_CONFIG extends {} = any,
  T_EXECUTION extends {} = any
> = {
  edit: EditData<T_CONFIG, T_EXECUTION>;
  onEditChanged?: (edit: EditData<T_CONFIG, T_EXECUTION>) => void;
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
editBuilders.register(editTypes.text, TextEditBuilderView);
//edits.register("layerSelect".shape, ShapeLayerUI);

export const builderUiModule: ModuleType = {
  layers,
  editBuilders,
};

export default builderUiModule;
