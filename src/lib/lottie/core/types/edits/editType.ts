import { Lottie } from "../lottieJson";
import { EditData } from "./editData";

export interface EditType<
  T_CONFIG extends object = {},
  T_EXECUTION extends object = {}
> {
  type: string;
  execute: (lottie: Lottie, edit: EditData<T_CONFIG, T_EXECUTION>) => void;
}
