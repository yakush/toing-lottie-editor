import { PartialRecord } from "../utils/PartialRecord";

export type colorSchemaSlots =
  | "primary"
  | "secondary"
  | "accent1"
  | "accent2"
  | "accent3"
  | "bg";

export const colorSchemaSlotNames: Record<colorSchemaSlots, string> = {
  primary: "primary",
  secondary: "secondary",
  accent1: "accent 1",
  accent2: "accent 2",
  accent3: "accent 3",
  bg: "background",
};

export type Color = string;

export type ColorsMappings = Record<colorSchemaSlots, Color | Color[]>;
export type PartialColorsMappings = PartialRecord<
  colorSchemaSlots,
  Color | Color[]
>;

export type ColorsPalette = Record<colorSchemaSlots, Color>;
export type PartialColorsPalette = PartialRecord<colorSchemaSlots, Color>;

export interface PaletteOption {
  name: string;
  description: string;
  colors: PartialColorsPalette;
}

//-------------------------------------------------------
// helpers
//-------------------------------------------------------

export function colorSchemaSlotToName(slot: colorSchemaSlots) {
  return colorSchemaSlotNames[slot];
}

export function getEmptyColorMapping(): Record<
  colorSchemaSlots,
  Color[] | undefined
> {
  return {
    primary: undefined,
    secondary: undefined,
    accent1: undefined,
    accent2: undefined,
    accent3: undefined,
    bg: undefined,
  };
}

export function getEmptyColorsPalette(): Record<
  colorSchemaSlots,
  Color | undefined
> {
  return {
    primary: undefined,
    secondary: undefined,
    accent1: undefined,
    accent2: undefined,
    accent3: undefined,
    bg: undefined,
  };
}
