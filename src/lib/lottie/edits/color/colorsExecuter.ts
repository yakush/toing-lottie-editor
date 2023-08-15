import { LottieColorRefHelper } from "../../core/LottieColorRefHelper";
import {
  PartialColorsPalette,
  colorSchemaSlots,
  getEmptyColorsPalette,
} from "../../core/colorSchema";
import { editTypes } from "../../enums";
import {
  EditEndpointExecuter,
  Lottie,
  ToingCampaign,
  ToingEditEndpoint,
} from "../../types";

export interface PaletteOption {
  name: string;
  description: string;
  colors: PartialColorsPalette;
}

export interface Config {
  /** slot => color in the json */
  slots?: PartialColorsPalette;

  /** optional predefined palettes */
  palettes?: PaletteOption[];
}

export interface Execution {
  selectedPalette: number; //-1 for user defined
  isCustomPalette: boolean;
  userDefinedColors?: PartialColorsPalette;
}

export default class ColorsExecuter
  implements EditEndpointExecuter<Config, Execution>
{
  type = editTypes.colors;

  createNewConfig(): Config {
    return {
      slots: getEmptyColorsPalette(),
      //palettes:[],
    };
  }

  createNewDefaults(
    lottie: Lottie | undefined,
    edit: ToingEditEndpoint<Config, Execution>
  ): Execution {
    let defaults: Execution = {
      isCustomPalette: false,
      selectedPalette: 0,
    };
    return defaults;
  }

  execute(
    lottie: Lottie,
    editEndpoint: ToingEditEndpoint<Config, Execution>,
    campaign?: ToingCampaign,
    execution?: Execution
  ) {
    const { config } = editEndpoint;

    let palette: PartialColorsPalette = getEmptyColorsPalette();
    //1. set to default

    //2. set to campaign

    //3. set to user-defined
    if (execution?.isCustomPalette) {
      for (const key in execution.userDefinedColors) {
        if (
          Object.prototype.hasOwnProperty.call(execution.userDefinedColors, key)
        ) {
          const slot = key as colorSchemaSlots;
          const color = execution.userDefinedColors[slot];
          if (color) {
            palette[slot] = color;
          }
        }
      }
    }

    // execute:
    const groups = LottieColorRefHelper.getColorGroups(lottie);

    for (const key in groups) {
      if (Object.prototype.hasOwnProperty.call(groups, key)) {
        const group = groups[key];
        const groupColor = group.colorHex;
        const refs = group.refs;

        let targetColor = groupColor;

        //find matching config chema entry (same color)
        if (config.slots) {
          const slotEntry = Object.entries(config.slots).find(
            ([key, value]) => value === groupColor
          );

          if (slotEntry) {
            const [key] = slotEntry;
            const slot = key as colorSchemaSlots;
            //find it in the palette
            const targetPaletteColor = palette[slot];

            if (targetPaletteColor) {
              targetColor = targetPaletteColor;
            }
          }
        }

        LottieColorRefHelper.setLottieColor(refs, targetColor);
      }
    }
  }
}
