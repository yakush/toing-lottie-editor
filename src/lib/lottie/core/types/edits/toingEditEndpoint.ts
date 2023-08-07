import { editTypes } from "../../enums";

export interface ToingEditEndpoint<
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
}
