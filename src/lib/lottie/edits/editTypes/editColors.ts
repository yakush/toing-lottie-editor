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
  userDefinedColors: Color[];
}

export default class EditText implements EditExecuter<Config, Execution> {
  type = editTypes.colors;

  createNewConfig(): Config {
    return {
      //colorTargets:[],
      //palettes:[],
    };
  }

  updateDefaults(
    lottie: Lottie,
    edit: EditData<Config, Execution>
  ): EditData<Config, Execution> {
    const newEdit = structuredClone(edit);
    return newEdit;
  }

  execute(lottie: Lottie, edit: EditData<Config, Execution>) {
    const { config, execution } = edit;
  }
}
