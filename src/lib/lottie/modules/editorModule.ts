import ColorsExecuter from "../edits/color/ColorsExecuter";
import LayerSelectorExecuter from "../edits/layerSelector/LayerSelectorExecuter";
import TextExecuter from "../edits/text/TextExecuter";
import { editTypes } from "../enums";
import Registry from "../helpers/registry";
import { EditEndpointExecuter } from "../types";

//-------------------------------------------------------
// register all editors below
//-------------------------------------------------------
const edits = new Registry<editTypes, EditEndpointExecuter<any, any>>();
edits.register(editTypes.colors, new ColorsExecuter());
edits.register(editTypes.layerSelector, new LayerSelectorExecuter());
edits.register(editTypes.text, new TextExecuter());

//-------------------------------------------------------

const editorModule = {
  edits,
};

export default editorModule;
