import { version } from "punycode";
import {
  EditData,
  EditExecuter,
  Lottie,
  TextLayer,
  editTypes,
  layerTypes,
} from "../../core";
import { textJustifications } from "../../core/enums/textJustifications";
import { findLayerRef } from "../../utils/lottieUtils";

type Color = string;

export interface ColorTarget {
  name: string;
  description: string;
  targetColor: Color;
}

export interface Palette {
  name: string;
  description: string;
  colors: Color[];
}

export interface Config {
  colorTargets?: ColorTarget[];
  palettes?: Palette[];
}

export interface Execution {
  selectedSchema: number; //-1 for user defined
  isCustomSchema: boolean;
  userDefinedColors?: Color[];
}

export default class EditText implements EditExecuter<Config, Execution> {
  type = editTypes.colors;

  createNewConfig(): Config {
    return {
      //colorTargets:[],
      //palettes:[],
    };
  }

  createNewDefaults(
    lottie: Lottie | undefined,
    edit: EditData<Config, Execution>
  ): Execution {
    let defaults: Execution = {
      isCustomSchema: false,
      selectedSchema: 0,
    };
    return defaults;
  }

  execute(lottie: Lottie, edit: EditData<Config, Execution>) {
    const { config, execution } = edit;
  }
}
