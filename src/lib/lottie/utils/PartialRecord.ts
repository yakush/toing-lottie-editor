/** like a Record<K,T> but the fields are optional */
export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};
