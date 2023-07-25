export interface EditData<
  T_CONFIG extends object = {},
  T_EXECUTION extends object = {}
> {
  type: string;
  id: string;
  name: string;
  description?: string;
  disabled?: boolean;

  config: T_CONFIG;
  defaults: T_EXECUTION;

  execution?: T_EXECUTION;
}
