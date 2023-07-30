import { EditsRegistry } from "../utils/editsRegistryClass";
import EditLayerSelector from "./editTypes/editLayerSelector";
import EditText from "./editTypes/editText";

const editsModule = new EditsRegistry();

/**
 * register all config definitions below
 */

editsModule.register(new EditText());
editsModule.register(new EditLayerSelector());

export default editsModule;
