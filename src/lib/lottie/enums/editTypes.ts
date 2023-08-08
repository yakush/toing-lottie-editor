export enum editTypes {
  colors = "colors",
  layerSelector = "layerSelector",
  text = "text",
}

export function exitTypeToName(type: editTypes): string {
  return editTypes[type] ?? "unknown";
}
