import { useLottieStore } from "../../app";
import { Layer, layerTypes } from "../../core";
import styles from "./LayerTitle.module.css";
import icon_layer from "../../assets/icon_layer.svg";
import { combineClasses } from "../../utils/css";
import { getLottieRef } from "../../utils/lottieUtils";
import useDragAndDropStore from "../../app/DragAndDrop";

type Props = {
  layer: Layer;
  children?: React.ReactNode;
};

export default function LayerTitle({ layer, children }: Props) {
  const blinkLayer = useLottieStore((state) => state.blinkLayer);
  const startDrag = useDragAndDropStore((store) => store.start);
  const endDrag = useDragAndDropStore((store) => store.end);

  const typeName = layerTypes[layer.ty] ?? "unknown";

  const onDragStart = (e: React.DragEvent) => {
    startDrag("layer", getLottieRef(layer));
  };
  const onDragEnd = (e: React.DragEvent) => {
    endDrag();
  };

  return (
    <div
      className={combineClasses(styles.root, {
        [styles.layerHidden]: !!layer.hd,
      })}
      onClick={() => blinkLayer(layer)}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onContextMenu={(e) => {
        e.preventDefault();
        console.log(JSON.stringify(getLottieRef(layer), null, 2));
      }}
    >
      <img className={styles.icon} src={icon_layer} alt="icon_layer" />
      <div className={styles.layer}>
        <div className={styles.header}>
          <div>[{layer.ind}]</div>
          <div className={styles.type}>[{typeName}]</div>
          <div className={styles.name}>{layer.nm}</div>
        </div>
        <div className={styles.children}>{children}</div>
      </div>
    </div>
  );
}
