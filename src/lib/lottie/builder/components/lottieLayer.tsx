import { Layer } from "../../core";
import builderUiModule from "../builderUiModule";

type Props = {
  layer: Layer;
};

export default function LottieLayer({ layer }: Props) {
  return builderUiModule.layers.getComponent(layer.ty, { layer });
}
