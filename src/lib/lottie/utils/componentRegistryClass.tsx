import { FunctionComponent, createElement } from "react";

export default class ComponentRegistry<T_TYPE, T_PROPS extends {}> {
  private components: Map<T_TYPE, FunctionComponent<T_PROPS>>;

  constructor() {
    this.components = new Map();
  }

  register(type: T_TYPE, component: FunctionComponent<T_PROPS>) {
    if (this.components.has(type)) {
      throw new Error(`type [${type}] already registered`);
    }

    this.components.set(type, component);
  }

  unregister(type: T_TYPE) {
    this.components.delete(type);
  }

  clear() {
    this.components.clear();
  }

  has(type: T_TYPE) {
    return this.components.has(type);
  }

  getComponent(type: T_TYPE, props?: T_PROPS) {
    const Comp = this.components.get(type) as FunctionComponent<any>;
    return Comp ? createElement(Comp, props) : <></>;
  }
}
