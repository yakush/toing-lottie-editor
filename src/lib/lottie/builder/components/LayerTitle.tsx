import { useLottieStore } from "../../app";
import { Layer, layerTypes } from "../../core";
import styles from "./LayerTitle.module.css";
import icon_layer from "../../assets/icon_layer.svg";
import { combineClasses } from "../../utils/css";
import { getLottieRef } from "../../utils/lottieUtils";

type Props = {
  layer: Layer;
  children?: React.ReactNode;
};

export default function LayerTitle({ layer, children }: Props) {
  const blinkLayer = useLottieStore((state) => state.blinkLayer);

  const typeName = layerTypes[layer.ty] ?? "unknown";

  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("targetType", "layer");
    e.dataTransfer.setData("typeName", typeName);
    //console.log("onDragStart",typeName);
  };

  // const onDrag = (e: React.DragEvent) => {    //console.log("onDrag",typeName);  };
  // const onDragEnd = (e: React.DragEvent) => {    //console.log("onDragEnd",typeName);  };
  // const onDragExit = (e: React.DragEvent) => {    //console.log("onDragExit",typeName);  };

  const onDragOver = (e: React.DragEvent) => {
    //console.log("onDragOver",typeName);
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    console.log(
      `onDrop : ${e.dataTransfer.getData(
        "targetType"
      )}:${e.dataTransfer.getData("typeName")}`
    );
  };

  return (
    <div
      className={combineClasses(styles.root, {
        [styles.layerHidden]: !!layer.hd,
      })}
      onClick={() => blinkLayer(layer)}
      draggable
      onDragStart={onDragStart}
      // onDrag={onDrag}
      // onDragEnd={onDragEnd}
      onDrop={onDrop}
      onDragOver={onDragOver}
      // onDragExit={onDragExit}
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
