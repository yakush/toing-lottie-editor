import { EditsRegistry } from "../utils/editsRegistryClass";
import EditLayerSelector from "./editTypes/editLayerSelector";
import EditText from "./editTypes/editText";

const registry = new EditsRegistry();

/**
 * register all config definitions below
 */

registry.register(new EditText());
registry.register(new EditLayerSelector());

export default registry;
