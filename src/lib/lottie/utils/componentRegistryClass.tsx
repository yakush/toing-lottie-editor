import { FunctionComponent, createElement } from "react";

export default class ComponentRegistry<T_TYPE, T_PROPS extends {}> {
  private components: Map<T_TYPE, FunctionComponent<T_PROPS>>;
  private unknownComponent: FunctionComponent<T_PROPS>;

  constructor() {
    this.components = new Map();
    this.unknownComponent = (props) => <></>;
  }

  register(type: T_TYPE, component: FunctionComponent<T_PROPS>) {
    if (this.components.has(type)) {
      throw new Error(`type [${type}] already registered`);
    }

    this.components.set(type, component);
  }

  registerUnknown(component: FunctionComponent<T_PROPS>) {
    this.unknownComponent = component;
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
    let Comp = this.components.get(type) as FunctionComponent<any>;
    if (!Comp) {
      Comp = this.unknownComponent ?? <></>;
    }
    return createElement(Comp, props);
  }
}
