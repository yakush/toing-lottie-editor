import { Layer } from "./layer";

export interface Asset {
  id: string; //ref
  nm: string; //name
  fr?: number; //framerate?
  layers?: Layer[];
  // [key: string]: any;
}
