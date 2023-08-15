import { shapeTypes } from "../../enums";
import { LottieColor } from "./lottieColor";

export interface Shape {
  ty: shapeTypes; //type
  nm: string; //name
  hd?: boolean;

  /** color */
  c?: LottieColor;

  /** gradient */
  g?: {
    /** keys */
    k?: LottieColor;
  };

  //   [key: string]: any;
}

export interface GroupShape extends Shape {
  it?: Shape[]; //items in group
}
