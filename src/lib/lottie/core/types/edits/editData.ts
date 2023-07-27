import { editTypes } from "../../enums";

export interface EditData<
  T_CONFIG extends object = {},
  T_EXECUTION extends object = {}
> {
  type: editTypes;
  id: string;
  name: string;
  description?: string;
  disabled?: boolean;

  config: T_CONFIG;
  defaults: T_EXECUTION;

  execution?: T_EXECUTION;
}
