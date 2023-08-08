import {
  ComponentClass,
  FunctionComponent,
  ReactNode,
  createElement,
} from "react";
import Registry from "./registry";

export default class ComponentsRegistry<
  T_TYPE,
  T_PROPS extends {}
> extends Registry<
  T_TYPE,
  FunctionComponent<T_PROPS> | ComponentClass<T_PROPS>
> {
  getComponent(key: T_TYPE, props?: T_PROPS, ...children: ReactNode[]) {
    const Comp = this.get(key);
    return Comp ? createElement(Comp, props, ...children) : <>{children}</>;
  }
}
