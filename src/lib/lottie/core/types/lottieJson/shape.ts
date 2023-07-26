import { shapeTypes } from "../../enums";



export interface Shape {
  ty: shapeTypes; //type
  nm: string; //name
  hd?:boolean;

  /** color */
  c?: Color;

  /** gradient */
  g?: {
    /** keys */
    k?: Color;
  };

  //   [key: string]: any;
}

export interface GroupShape extends Shape {
  it?: Shape[]; //items in group
}

//-------------------------------------------------------
// COLOR
//-------------------------------------------------------

export interface Color {
  a?: number;
  ix?: number;
  k: number[] | ColorKeyFrame[];
}

export interface ColorKeyFrame {
  i: { x: number; y: number };
  o: { x: number; y: number };
  s: number[];
  t: number;
}

export function isSimpleLottieColor(c: Color) {
  const { a } = c;
  return a === 0 || a === undefined;
}
