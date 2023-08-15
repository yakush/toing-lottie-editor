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
import { LottieColorRefHelper } from "./LottieColorRefHelper";
import { LottieRefHelper } from "./LottieRefHelper";

export const LottieHelper = {
  digestLottie,
  executeLottieEdits,
  collectSubShapesTargets,
};

//-------------------------------------------------------

function digestLottie(lottie?: Lottie, config?: ToingConfig) {
  if (lottie) {
    LottieRefHelper.createLottieRefs(lottie);
    LottieColorRefHelper.createColorGroups(lottie);
  }
}

function executeLottieEdits(
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
}

function collectSubShapesTargets(target: Layer | Shape) {
  let allTargets: (Layer | Shape)[] = [];
  function addSubTargets(shape: Layer | Shape) {
    allTargets.push(shape);
    if (shape.ty === shapeTypes.group) {
      (shape as GroupShape).it?.forEach(addSubTargets);
    }
  }
  addSubTargets(target);
  return allTargets;
}
