import ComponentsRegistry from "../helpers/componentsRegistry";
import { editTypes } from "../enums";
import { ToingEditEndpoint } from "../types";
import UnknownEditView from "../edits/unknown/UnknownEditView";
import TextEditView from "../edits/text/TextEditView";
import LayerSelectorEditView from "../edits/layerSelector/LayerSelectorEditView";
import ColorsEditView from "../edits/color/ColorsEditView";

//-------------------------------------------------------
// register all edit components
//-------------------------------------------------------
const edits = new ComponentsRegistry<editTypes, EditProps>();
edits.registerDefault(UnknownEditView);
edits.register(editTypes.colors, ColorsEditView);
edits.register(editTypes.layerSelector, LayerSelectorEditView);
edits.register(editTypes.text, TextEditView);

//-------------------------------------------------------

export type EditProps<
  T_CONFIG extends {} = any,
  T_EXECUTION extends {} = any
> = {
  editEndpoint: ToingEditEndpoint<T_CONFIG, T_EXECUTION>;
  execution: T_EXECUTION;
  onChange?: (execution: T_EXECUTION) => void;
};

//-------------------------------------------------------

const editorUiModule = {
  edits,
};

export default editorUiModule;
