export enum editTypes {
  colors = "colors",
  layerSelect = "layerSelect",
  text = "text",
}

export function exitTypeToName(type: editTypes): string {
  return editTypes[type] ?? "unknown";
}
