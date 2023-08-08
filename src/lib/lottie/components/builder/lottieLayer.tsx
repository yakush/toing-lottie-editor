import lottieLayersUiModule from "../../modules/lottieLayersUiModule";
import useToingStore from "../../stores/ToingStore";
import { Layer } from "../../types";
import styles from "./lottieLayer.module.css";

type Props = {
  layer: Layer;
};

export default function LottieLayer({ layer }: Props) {
  useToingStore((state) => state.lottie);

  return (
    <div className={styles.root}>
      {lottieLayersUiModule.layers.getComponent(layer.ty, { layer })}
    </div>
  );
}
