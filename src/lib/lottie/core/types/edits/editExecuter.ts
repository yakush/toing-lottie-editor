import { editTypes } from "../../enums";
import { Lottie } from "../lottieJson";
import { EditData } from "./editData";

export interface EditExecuter<
  T_CONFIG extends object = {},
  T_EXECUTION extends object = {}
> {
  type: editTypes;
  createNewConfig: () => T_CONFIG;
  createNewDefaults: (
    lottie: Lottie | undefined,
    edit: EditData<T_CONFIG, T_EXECUTION>
  ) => T_EXECUTION;
  execute: (lottie: Lottie, edit: EditData<T_CONFIG, T_EXECUTION>) => void;
}
