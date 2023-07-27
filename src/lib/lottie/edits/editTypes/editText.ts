import { EditData, EditExecuter, Lottie, editTypes } from "../../core";
import { LayerRef } from "../../core/types/edits/lottieRef";

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

export default class EditText implements EditExecuter<Config, Execution> {
  type = editTypes.text;
  
  execute(lottie: Lottie, edit: EditData<Config, Execution>) {

  }
}
