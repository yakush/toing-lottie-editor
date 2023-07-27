import { editTypes } from "../../enums";
import { Lottie } from "../lottieJson";
import { EditData } from "./editData";

export interface EditExecuter<
  T_CONFIG extends object = {},
  T_EXECUTION extends object = {}
> {
  type: editTypes;
  execute: (lottie: Lottie, edit: EditData<T_CONFIG, T_EXECUTION>) => void;
}
