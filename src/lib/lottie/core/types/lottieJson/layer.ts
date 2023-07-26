import { Shape } from "./shape";

export interface Layer {
  /** type */
  ty: number;
  /** name */
  nm?: string;
  /** hidden */
  hd?: boolean;
  /** index */
  ind: number;

  //   [key: string]: any;
}

export interface SolidLayer extends Layer {
  /** hex color string */
  sc?: string;
}

export interface TextLayer extends Layer {
  t?: {
    d?: {
      k?: {
        s?: {
          t?: string; //text
        //   [key: string]: any;
        };
      }[];
    };
  };
}

export interface PrecompLayer extends Layer {
  /** ref to asset */
  refId?: string;
}

export interface ShapeLayer extends Layer {
  shapes?: Shape[];
}
