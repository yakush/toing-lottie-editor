import {
  EditEndpointExecuter,
  Lottie,
  ToingEditEndpoint,
  editTypes,
} from "../../core";

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

export default class EditText
  implements EditEndpointExecuter<Config, Execution>
{
  type = editTypes.colors;

  createNewConfig(): Config {
    return {
      //colorTargets:[],
      //palettes:[],
    };
  }

  createNewDefaults(
    lottie: Lottie | undefined,
    edit: ToingEditEndpoint<Config, Execution>
  ): Execution {
    let defaults: Execution = {
      isCustomSchema: false,
      selectedSchema: 0,
    };
    return defaults;
  }

  execute(
    lottie: Lottie,
    editEndpoint: ToingEditEndpoint<Config, Execution>,
    execution: Execution
  ) {
    const { config } = editEndpoint;
  }
}
