import { Layer, layerTypes } from "../core";
import ComponentRegistry from "../utils/componentRegistryClass";
import BuilderShapeLayer from "./components/layers/builderShaperLayer";
import BuilderTextLayer from "./components/layers/builderTextLayer";

export type LayerProps<T extends Layer = Layer> = {
  layer: T;
};

export type EditProps<T extends {} = {}> = {
  type: string;
  data: T;
};

export interface ModuleType {
  layers: ComponentRegistry<layerTypes, LayerProps>;
  edits: ComponentRegistry<string, EditProps>;
}

const layers = new ComponentRegistry<layerTypes, LayerProps>();
layers.register(layerTypes.text, BuilderTextLayer);
layers.register(layerTypes.shape, BuilderShapeLayer);

const edits = new ComponentRegistry<string, EditProps>();
//edits.register("color", TextLayerUI);
//edits.register("layerSelect".shape, ShapeLayerUI);

export const builderUiModule: ModuleType = {
  layers,
  edits,
};

export default builderUiModule;
