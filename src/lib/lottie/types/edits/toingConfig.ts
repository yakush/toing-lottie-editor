import { ToingEditEndpoint } from "./toingEditEndpoint";

export interface ToingConfig {
  editEndpoints?: ToingEditEndpoint[];
}

export const default_ToingConfig: ToingConfig = {
  editEndpoints: [],
};
