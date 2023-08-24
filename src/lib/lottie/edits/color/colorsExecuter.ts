import { LottieColorRefHelper } from "../../core/LottieColorRefHelper";
import {
  PaletteOption,
  PartialColorsMappings,
  PartialColorsPalette,
  colorSchemaSlots,
} from "../../core/colorSchema";
import { editTypes } from "../../enums";
import {
  EditEndpointExecuter,
  Lottie,
  LottieColorRefGroup,
  ToingCampaign,
  ToingEditEndpoint,
} from "../../types";
import { defaultColorsPaletteOption } from "./defaultColors";

export interface Config {
  /** slot => color(s) in the json */
  slots?: PartialColorsMappings;

  /** optional predefined palettes (currently not in use)
   */

  palettes?: PaletteOption[];
}

export type ColorPaletteSource = "original" | "campaign" | "user";

export interface Execution {
  paletteSource: ColorPaletteSource;
  selectedPalette: number; //from campaign palettes
  userDefinedColors?: PartialColorsPalette;
}

export default class ColorsExecuter
  implements EditEndpointExecuter<Config, Execution>
{
  type = editTypes.colors;

  createNewConfig(): Config {
    return {
      slots: {
        primary: undefined,
        secondary: undefined,
        accent1: undefined,
        accent2: undefined,
        accent3: undefined,
        bg: undefined,
      },
      //palettes:[],
    };
  }

  createNewDefaults(
    lottie: Lottie | undefined,
    edit: ToingEditEndpoint<Config, Execution>
  ): Execution {
    let defaults: Execution = {
      paletteSource: "original",
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

    const colorGroups = LottieColorRefHelper.getColorGroups(lottie);

    let targetColorSlots: {
      slot: colorSchemaSlots;
      groups: LottieColorRefGroup[];
      targetColor?: string;
    }[] = [];

    // 1. append slots from config
    if (config?.slots) {
      for (const key in config.slots) {
        if (Object.prototype.hasOwnProperty.call(config.slots, key)) {
          const slot = key as colorSchemaSlots;
          let slotColors = config.slots[slot];

          if (!slotColors) {
            continue;
          }

          if (typeof slotColors === "string") {
            slotColors = [slotColors];
          }

          const groups = colorGroups.filter((group) =>
            slotColors?.includes(group.colorHex)
          );

          targetColorSlots.push({
            slot,
            groups,
          });
        }
      }
    }

    //2. from campaign (option at position 0):
    if (execution?.paletteSource === "campaign") {
      let campaignPalette = campaign?.colors && campaign.colors[0];
      if (!campaignPalette || !campaignPalette.colors) {
        campaignPalette = defaultColorsPaletteOption;
      }
      const campaignColors = campaignPalette.colors;

      targetColorSlots.forEach((group) => {
        const targetColor = campaignColors[group.slot];
        if (targetColor) {
          group.targetColor = targetColor;
        }
      });
    }

    //3. set to user-defined
    if (execution?.paletteSource === "user") {
      const userColors = execution?.userDefinedColors;
      if (userColors) {
        targetColorSlots.forEach((group) => {
          const targetColor = userColors[group.slot];
          if (targetColor) {
            group.targetColor = targetColor;
          }
        });
      }
    }

    // execute:

    //1. reset all to default:
    colorGroups.forEach((group) => {
      LottieColorRefHelper.setLottieColor(group.refs, group.colorHex);
    });

    //2. apply target colors:
    targetColorSlots.forEach((targetGroup) => {
      targetGroup.groups.forEach((colorGroup) => {
        const targetColor = targetGroup.targetColor ?? colorGroup.colorHex;
        LottieColorRefHelper.setLottieColor(colorGroup.refs, targetColor);
      });
    });
  }
}
