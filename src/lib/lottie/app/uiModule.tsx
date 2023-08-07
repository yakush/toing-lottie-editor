import { ToingEditEndpoint, editTypes } from "../core";
import ComponentRegistry from "../utils/componentRegistryClass";
import LayerSelectEditView from "./components/edits/LayerSelectEditView";
import TextEditView from "./components/edits/TextEditView";
import UnknownEditView from "./components/edits/UnknownEditView";

export type EditProps<
  T_CONFIG extends {} = any,
  T_EXECUTION extends {} = any
> = {
  editEndpoint: ToingEditEndpoint<T_CONFIG, T_EXECUTION>;
  execution: T_EXECUTION;
  onChange?: (execution: T_EXECUTION) => void;
};

export interface ModuleType {
  edits: ComponentRegistry<editTypes, EditProps>;
}
const edits = new ComponentRegistry<editTypes, EditProps>();
edits.registerUnknown(UnknownEditView);
edits.register(editTypes.text, TextEditView);
edits.register(editTypes.layerSelect, LayerSelectEditView);
edits.register(editTypes.colors, () => <div>colors</div>);

const uiModule: ModuleType = {
  edits,
};

export default uiModule;
