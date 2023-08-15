import { effectTypes } from "../../enums";

export interface Effect {
  /** type */
  ty: effectTypes;

  nm?: string;
  mn?: string;
  ix?: number;

  /** value */
  v?: {
    a?: 0 | 1;
    ix: number;
    k: any | any[];
  };

  /** sub effects */
  ef?: Effect[];
}
