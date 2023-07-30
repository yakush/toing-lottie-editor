import { editTypes } from "../core";
import { EditData, EditExecuter, Lottie, LottieEdits } from "../core/types";

export class EditsRegistry {
  private editTypes: Map<editTypes, EditExecuter>;

  constructor() {
    this.editTypes = new Map();
  }

  register(editType: EditExecuter<any, any>) {
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

  getExecuter(type:editTypes){
    return this.editTypes.get(type);
  }

  executeAll(lottie: Lottie, edits: LottieEdits) {
    edits.edits?.forEach((edit) => this.execute(lottie, edit));
  }

  execute(lottie: Lottie, edit: EditData) {
    const { execution, type } = edit;
    const handler = this.getExecuter(type);

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

    handler.execute(lottie, edit);
  }

  //-------------------------------------------------------

  setDefaultsAll(edits: LottieEdits) {
    edits.edits?.forEach((edit) => this.setDefaults(edit));
  }

  setDefaults(edit: EditData) {
    const { defaults } = edit;

    if (!defaults) {
      console.warn(
        `unable to find defaults for edit [${edit.name}] id: ${edit.id}`
      );
      edit.execution = undefined;
      return;
    }

    edit.execution = structuredClone(defaults);
  }
}
