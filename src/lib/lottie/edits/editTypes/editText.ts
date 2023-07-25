import { EditData, EditType, Lottie } from "../../core";
import { LayerRef } from "../../core/types/refs";

export interface Config {
  targetLayer: LayerRef;
  enableMultiline: boolean;
  enableAlign: boolean;
  enableColor: boolean;
}

export interface Execution {
  text: string;
  align?: number;
  color: string;
}

export default class EditText implements EditType<Config, Execution> {
  type = "text";
  execute(lottie: Lottie, edit: EditData<Config, Execution>) {}
}
