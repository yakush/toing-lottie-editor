import { editTypes } from "../core";
import ComponentRegistry from "../utils/componentRegistryClass";

type EditProps = {
  type: string;
  data: any;
};

export interface ModuleType {
  edits: ComponentRegistry<editTypes, EditProps>;
}
const edits = new ComponentRegistry<editTypes, EditProps>();
//edits.register(editTypes.colors, TextLayerUI);
//edits.register(editTypes.layerSelect, ShapeLayerUI);

const uiModule: ModuleType = {
  edits,
};

export default uiModule;
