import { Lottie, editTypes } from "../../core";
import { EditData, EditExecuter } from "../../core/types/edits";
import { LottieRef } from "../../core/types/edits/lottieRef";

export interface Config {
  enableHide: boolean;
  options: {
    name: string;
    description: string;
    targets: LottieRef[];
  }[];
}

export interface Execution {
  hide?: boolean;
  selectedIdx?: number;
}

export default class EditLayerSelector
  implements EditExecuter<Config, Execution>
{
  type = editTypes.layerSelect;

  createNewConfig(): Config {
    return {
      enableHide: false,
      options: [],
    };
  }

  updateDefaults(
    lottie: Lottie,
    edit: EditData<Config, Execution>
  ): EditData<Config, Execution> {
    const newEdit = structuredClone(edit);
    return newEdit;
  }

  execute(lottie: Lottie, edit: EditData<Config, Execution>) {}
}
