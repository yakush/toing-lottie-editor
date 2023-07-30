import { editTypes } from "../../enums";
import { Lottie } from "../lottieJson";
import { EditData } from "./editData";

export interface EditExecuter<
  T_CONFIG extends object = {},
  T_EXECUTION extends object = {}
> {
  type: editTypes;
  createNewConfig: () => T_CONFIG;
  updateDefaults: (
    lottie: Lottie,
    edit: EditData<T_CONFIG, T_EXECUTION>
  ) => EditData<T_CONFIG, T_EXECUTION>;
  execute: (lottie: Lottie, edit: EditData<T_CONFIG, T_EXECUTION>) => void;
}
