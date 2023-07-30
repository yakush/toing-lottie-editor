import React from "react";
import {
  GroupShape,
  Shape,
  ShapeLayer,
  shapeTypeToName,
  shapeTypes,
} from "../../../core";
import { LayerProps } from "../../builderUiModule";
import LayerTitle from "../LayerTitle";
import List from "../List";
import ListHeader from "../ListHeader";

import styles from "./builderShapeLayer.module.css";
import { useLottieStore } from "../../../app";
import icon_shape from "../../../assets/icon_shape.svg";
import { getLottieRef } from "../../../utils/lottieUtils";
import useDragAndDropStore from "../../../app/DragAndDrop";
import { combineClasses } from "../../../utils/css";

const BuilderShapeLayer = ({ layer }: LayerProps<ShapeLayer>) => {
  return (
    <div className={styles.root}>
      <ShapeList shapes={layer.shapes}>
        <LayerTitle layer={layer} />
      </ShapeList>
    </div>
  );
};

//-------------------------------------------------------

type ShapeListProps = {
  shapes?: Shape[];
  children?: React.ReactNode;
};

const ShapeList = ({ children, shapes }: ShapeListProps) => {
  return (
    <List lineColor="slateblue">
      <ListHeader>{children}</ListHeader>

      {shapes?.map((shape, i) => {
        const shapeIsGroup = shape.ty === shapeTypes.group;
        const subShapes = shapeIsGroup ? (shape as GroupShape).it : undefined;

        return (
          <ShapeList key={i} shapes={subShapes}>
            <ShapeTitle shape={shape} />
          </ShapeList>
        );
      })}
    </List>
  );
};

//-------------------------------------------------------

type ShapeTitleProps = {
  shape: Shape;
};

const ShapeTitle = ({ shape }: ShapeTitleProps) => {
  const blinkShape = useLottieStore((state) => state.blinkShape);

  const startDrag = useDragAndDropStore((store) => store.start);
  const endDrag = useDragAndDropStore((store) => store.end);

  const onDragStart = (e: React.DragEvent) => {
    startDrag("shape", getLottieRef(shape));
  };
  const onDragEnd = (e: React.DragEvent) => {
    endDrag();
  };

  return (
    <div
      className={combineClasses({
        [styles.shapeTitle]: true,
        [styles.shapeHidden]: !!shape.hd,
      })}
      onClick={() => blinkShape(shape)}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onContextMenu={(e) => {
        e.preventDefault();
        console.log(JSON.stringify(getLottieRef(shape), null, 2));
      }}
    >
      <img className={styles.icon} src={icon_shape} alt="icon_layer" />
      <div className={styles.type}>{shapeTypeToName(shape.ty)}</div>
      <div className={styles.name}>{shape.nm}</div>
    </div>
  );
};

export default BuilderShapeLayer;
