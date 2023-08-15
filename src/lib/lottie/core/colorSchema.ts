import { PartialRecord } from "../utils/PartialRecord";

export type colorSchemaSlots =
  | "primary1"
  | "primary2"
  | "accent1"
  | "accent2"
  | "bg";

export const colorSchemaSlotNames: Record<colorSchemaSlots, string> = {
  primary1: "primary 1",
  primary2: "primary 2",
  accent1: "accent 1",
  accent2: "accent 2",
  bg: "background",
};

export type PartialColorsPalette = PartialRecord<colorSchemaSlots, string>;
export type ColorsPalette = Record<colorSchemaSlots, string>;

export function getEmptyColorsPalette(): Record<
  colorSchemaSlots,
  string | undefined
> {
  return {
    primary1: undefined,
    primary2: undefined,
    accent1: undefined,
    accent2: undefined,
    bg: undefined,
  };
}

export function colorSchemaSlotToName(slot: colorSchemaSlots) {
  return colorSchemaSlotNames[slot];
}
