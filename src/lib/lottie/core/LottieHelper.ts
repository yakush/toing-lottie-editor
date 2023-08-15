import { shapeTypes } from "../enums";
import editsModule from "../modules/editorModule";
import {
  GroupShape,
  Layer,
  Lottie,
  Shape,
  ToingCampaign,
  ToingConfig,
  ToingUserExecutions,
} from "../types";

export const LottieHelper = {
  executeLottieEdits(
    lottie: Lottie,
    config?: ToingConfig,
    userExecutions?: ToingUserExecutions,
    campaign?: ToingCampaign
  ) {
    config?.editEndpoints?.forEach((edit) => {
      const exec =
        userExecutions?.executions && userExecutions?.executions[edit.id];
      editsModule.edits.get(edit.type)?.execute(lottie, edit, campaign, exec);
    });
  },

  collectSubShapesTargets(target: Layer | Shape) {
    let allTargets: (Layer | Shape)[] = [];
    function addSubTargets(shape: Layer | Shape) {
      allTargets.push(shape);
      if (shape.ty === shapeTypes.group) {
        (shape as GroupShape).it?.forEach(addSubTargets);
      }
    }
    addSubTargets(target);
    return allTargets;
  },
};
