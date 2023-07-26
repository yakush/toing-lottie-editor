import { useLottieStore } from "../../app";
import { Layer, layerTypes } from "../../core";
import styles from "./LayerTitle.module.css";

type Props = {
  layer: Layer;
};

export default function LayerTitle({ layer }: Props) {
  const blinkLayer = useLottieStore((state) => state.blinkLayer);

  const typeName = layerTypes[layer.ty] ?? "unknown";

  return (
    <div className={styles.root} onClick={()=>blinkLayer(layer)}>
      <div className={styles.type}>[{typeName}]</div>
      <div className={styles.name}>{layer.nm}</div>
    </div>
  );
}
