import { editTypes } from "../../enums";
import { Lottie } from "../lottieJson";
import { ToingEditEndpoint } from "./toingEditEndpoint";

export interface EditEndpointExecuter<
  T_CONFIG extends object = {},
  T_EXECUTION extends object = {}
> {
  type: editTypes;
  createNewConfig: () => T_CONFIG;

  createNewDefaults: (
    lottie: Lottie | undefined,
    edit: ToingEditEndpoint<T_CONFIG, T_EXECUTION>
  ) => T_EXECUTION;

  execute: (
    lottie: Lottie,
    editEndpoint: ToingEditEndpoint<T_CONFIG, T_EXECUTION>,
    execution: T_EXECUTION
  ) => void;
}
