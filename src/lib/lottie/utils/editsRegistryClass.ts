import { editTypes } from "../core";
import {
  ToingEditEndpoint,
  EditEndpointExecuter,
  Lottie,
  ToingConfig,
  ToingUserExecutions,
  ToingCampaign,
} from "../core/types";

export class EditsRegistry {
  private editTypes: Map<editTypes, EditEndpointExecuter>;

  constructor() {
    this.editTypes = new Map();
  }

  register(editType: EditEndpointExecuter<any, any>) {
    const { type } = editType;
    if (this.editTypes.has(type)) {
      throw new Error(`handler for type [${type}] already registered`);
    }

    this.editTypes.set(type, editType);
  }

  unregister(type: editTypes) {
    this.editTypes.delete(type);
  }

  clear() {
    this.editTypes.clear();
  }

  getExecuter(type: editTypes) {
    return this.editTypes.get(type);
  }

  execute(lottie: Lottie, edit: ToingEditEndpoint, execution: object) {
    const { type, defaults } = edit;

    const handler = this.getExecuter(type);

    if (!defaults) {
      console.warn(
        `unable to find default data for edit [${edit.name}] id: ${edit.id}`
      );
      // console.log(structuredClone (edit));
      return;
    }

    if (!execution) {
      console.warn(
        `unable to find execution data for edit [${edit.name}] id: ${edit.id}`
      );
      // console.log(structuredClone (edit));
      return;
    }

    if (!handler) {
      console.warn(`unable to find handler for type [${type}]`);
      return;
    }

    handler.execute(lottie, edit, execution);
  }
}
