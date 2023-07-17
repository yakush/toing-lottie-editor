import { Asset } from "./asset";
import { Layer } from "./layer";

export interface Lottie {
  layers?: Layer[];
  assets?: Asset[];
}
