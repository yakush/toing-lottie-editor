import { Lottie } from "../../core";
import { EditData, EditType } from "../../core/types/edits";
import { LottieRef } from "../../core/types/refs";

export interface Config {
  targetLayers: LottieRef[];
  enableNoSelect: boolean;
}

export interface Execution {
  selection: number;
}

export default class EditLayerSelector implements EditType<Config, Execution> {
  type = "layer";
  execute(lottie: Lottie, edit: EditData<Config, Execution>) {}
}
