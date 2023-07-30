import { Layer, Lottie, Shape, editTypes } from "../../core";
import { EditData, EditExecuter } from "../../core/types/edits";
import { LottieRef } from "../../core/types/edits/lottieRef";
import { findLottieRef } from "../../utils/lottieUtils";

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

  createNewDefaults(
    lottie: Lottie | undefined,
    edit: EditData<Config, Execution>
  ): Execution {
    let defaults: Execution = {
      hide: false,
      selectedIdx: 0,
    };
    return defaults;
  }

  execute(lottie: Lottie, edit: EditData<Config, Execution>) {
    console.log("EXEC LAYER SELECT");
    const { config, execution } = edit;
    const selectedIdx =
      execution?.selectedIdx != null ? execution?.selectedIdx : 0;
    const hide = execution?.hide != null ? execution?.hide : 0;

    config?.options?.forEach((option, i) => {
      const targets = option.targets.reduce<(Shape | Layer)[]>((acc, ref) => {
        const target = findLottieRef(lottie, ref);
        if (target) {
          acc.push(target);
        }
        return acc;
      }, []);

      targets.forEach((target) => {
        //hide all
        if (config.enableHide && hide) {
          target.hd = true;
          return;
        }
        //hide non selected
        target.hd = !(selectedIdx === i);
      });
    });
  }
}
