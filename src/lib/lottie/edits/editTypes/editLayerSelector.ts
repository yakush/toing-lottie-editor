import { Lottie, editTypes } from "../../core";
import { EditData, EditExecuter } from "../../core/types/edits";
import { LottieRef } from "../../core/types/edits/lottieRef";

export interface Config {
  targetLayers: LottieRef[];
  enableNoSelect: boolean;
}

export interface Execution {
  selection: number;
}

export default class EditLayerSelector
  implements EditExecuter<Config, Execution>
{
  type = editTypes.layerSelect;
  execute(lottie: Lottie, edit: EditData<Config, Execution>) {}
}
