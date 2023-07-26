import { useLottieStore } from "../../app";
import { Layer } from "../../core";
import builderUiModule from "../builderUiModule";
import styles from "./lottieLayer.module.css";

type Props = {
  layer: Layer;
};

export default function LottieLayer({ layer }: Props) {
  
  useLottieStore((state) => state.lottie);

  return (
    <div className={styles.root}>
      {builderUiModule.layers.getComponent(layer.ty, { layer })}
    </div>
  );
}
