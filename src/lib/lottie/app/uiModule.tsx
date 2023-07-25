import ComponentRegistry from "../utils/componentRegistryClass";

type EditProps = {
  type: string;
  data: any;
};

export interface ModuleType {
  edits: ComponentRegistry<string, EditProps>;
}
const edits = new ComponentRegistry<string, EditProps>();
//edits.register(layerTypes.text, TextLayerUI);
//edits.register(layerTypes.shape, ShapeLayerUI);

const uiModule: ModuleType = {
  edits,
};

export default uiModule;
