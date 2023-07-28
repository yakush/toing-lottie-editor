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

  /** stretch time */
  sr?: number;
  /** inPoint time */
  ip?: number;
  /** outPoint time */
  op?: number;
  /** start time */
  st?: number;
  /** collapseTransformation */
  ct?: number;

  /** blend mode */
  bm?: number;

  //   [key: string]: any;
}

export interface SolidLayer extends Layer {
  /** hex color string */
  sc?: string;
  /*layerInfo.source.width */
  sw?: number;
  /*layerInfo.source.height; */
  sh?: number;
}

export interface TextLayer extends Layer {
  t?: {
    /** document data */
    d?: {
      /** keys */
      k?: {
        s?: {
          /** boxTextSize */
          sz?: any;
          /** boxTextPos */
          ps?: any;
          /** fontSize */
          s?: number;
          /** font */
          f?: string;
          /** text */
          t?: string;
          /** caps : 0: normal , 1:caps , 2:small */
          ca?: number;
          /** justification  */
          j?: number | undefined;
          /** tracking */
          tr?: number;
          /** line height */
          lh?: number;
          /** line shift  */
          ls?: number;
          /** fill colors array */
          fc?: number[];
          /** stroke colors array */
          sc?: number[];
          /** stroke width */
          sw?: number;
          /** strokeOverFill */
          of?: any;
        };

        /* time */
        t?: number;
      }[];
    };
    /* Path Data*/
    p?: {
      /**  value ("Path").value - 1;*/
      m?: number;
      /**  keyframes ("First Margin")*/
      f?: any;
      /**  keyframes ("Last Margin")*/
      l?: any;
      /**  keyframes ("Force Alignment")*/
      a?: any;
      /**  keyframes ("Perpendicular To Path")*/
      p?: any;
      /**  keyframes ("Reverse Path")*/
      r?: any;
    };
    /*more options data */
    m?: {
      /** anchor point grouping */
      g?: number;
      /** Grouping Alignment */
      a?: {
        /** animated (0 | 1) */
        a?: number;
        /** keys */
        k?: any[];
        /** prop index*/
        ix?: number;
      };
    };
  };
}

export interface PrecompLayer extends Layer {
  /** ref to asset */
  refId?: string;

  w?: number;
  h?: number;
}

export interface ShapeLayer extends Layer {
  shapes?: Shape[];
}
