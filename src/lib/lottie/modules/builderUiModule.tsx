import LayerSelectorBuilderView from "../edits/layerSelector/LayerSelectorBuilderView";
import TextBuilderView from "../edits/text/TextBuilderView";
import { editTypes } from "../enums";
import ComponentsRegistry from "../helpers/componentsRegistry";
import { ToingEditEndpoint } from "../types";

//-------------------------------------------------------
// register all edit-builder components
//-------------------------------------------------------
const editBuilders = new ComponentsRegistry<editTypes, EditBuilderProps>();
//editBuilders.register(editTypes.colors, ....);
editBuilders.register(editTypes.layerSelector, LayerSelectorBuilderView);
editBuilders.register(editTypes.text, TextBuilderView);

//-------------------------------------------------------

export type EditBuilderProps<
  T_CONFIG extends {} = any,
  T_EXECUTION extends {} = any
> = {
  edit: ToingEditEndpoint<T_CONFIG, T_EXECUTION>;
  onEditChanged?: (edit: ToingEditEndpoint<T_CONFIG, T_EXECUTION>) => void;
};

//-------------------------------------------------------
export const builderUiModule = {
  editBuilders,
};

export default builderUiModule;
