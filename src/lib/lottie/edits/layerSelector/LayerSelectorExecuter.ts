import { editTypes } from "../../enums";
import {
  EditEndpointExecuter,
  Layer,
  Lottie,
  LottieRef,
  Shape,
  ToingEditEndpoint,
} from "../../types";
import {
  collectSubShapesTargets,
  findLottieRef,
} from "../../utils/lottieUtils";

export interface LayerSelectorOption {
  id: string;
  name: string;
  description: string;
  targets: LottieRef[];
}

export interface Config {
  enableHide: boolean;
  options: LayerSelectorOption[];
}

export interface Execution {
  hide?: boolean;
  selectedIdx?: number;
}

export default class LayerSelectorExecuter
  implements EditEndpointExecuter<Config, Execution>
{
  type = editTypes.layerSelector;

  createNewConfig(): Config {
    return {
      enableHide: false,
      options: [],
    };
  }

  createNewDefaults(
    lottie: Lottie | undefined,
    edit: ToingEditEndpoint<Config, Execution>
  ): Execution {
    let defaults: Execution = {
      hide: false,
      selectedIdx: 0,
    };
    return defaults;
  }

  execute(
    lottie: Lottie,
    editEndpoint: ToingEditEndpoint<Config, Execution>,
    execution: Execution
  ) {
    // console.log("EXEC LAYER SELECT");
    const { config } = editEndpoint;
    const selectedIdx =
      execution?.selectedIdx != null ? execution?.selectedIdx : 0;
    const hide = execution?.hide != null ? execution?.hide : 0;

    // hide all:
    config?.options?.forEach((option, i) => {
      const targets = option.targets.reduce<(Shape | Layer)[]>((acc, ref) => {
        const target = findLottieRef(lottie, ref);
        if (target) {
          const targetAndSubs = collectSubShapesTargets(target);
          acc.push(...targetAndSubs);
        }
        return acc;
      }, []);

      targets.forEach((target) => (target.hd = true));
    });

    //if hide all - we're done
    if (config.enableHide && hide) {
      return;
    }

    // show only selected targets:
    // (do this last. this allows same targets to be on different option,
    // but this final iteration will allow only selected to be shown)
    {
      const selectedOption = config?.options?.at(selectedIdx);
      if (!selectedOption) {
        return;
      }
      const targets = selectedOption.targets.reduce<(Shape | Layer)[]>(
        (acc, ref) => {
          const target = findLottieRef(lottie, ref);
          if (target) {
            const targetAndSubs = collectSubShapesTargets(target);
            acc.push(...targetAndSubs);
          }
          return acc;
        },
        []
      );

      //show
      targets.forEach((target) => {
        target.hd = false;
      });
    }
  }
}
