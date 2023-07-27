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

  const onDragStart = (shape: Shape, e: React.DragEvent) => {
    e.dataTransfer.setData("targetType", "shape");
    e.dataTransfer.setData("typeName", shapeTypeToName(shape.ty));
    //console.log("onDragStart",typeName);
  };

  // const onDrag shape:Shape, = (e: React.DragEvent) => {    //console.log("onDrag",typeName);  };
  // const onDragEnd shape:Shape, = (e: React.DragEvent) => {    //console.log("onDragEnd",typeName);  };
  // const onDragExit shape:Shape, = (e: React.DragEvent) => {    //console.log("onDragExit",typeName);  };

  const onDragOver = (shape: Shape, e: React.DragEvent) => {
    //console.log("onDragOver",typeName);
    e.preventDefault();
  };

  const onDrop = (shape: Shape, e: React.DragEvent) => {
    e.preventDefault();
    console.log(
      `onDrop : ${e.dataTransfer.getData(
        "targetType"
      )}:${e.dataTransfer.getData("typeName")}`
    );
  };

  return (
    <div
      className={styles.shapeTitle}
      onClick={() => blinkShape(shape)}
      draggable
      onDragStart={(e) => onDragStart(shape, e)}
      // onDrag={(e)=>onDrag(shape,e)}
      // onDragEnd={(e)=>onDragEnd(shape,e)}
      onDrop={(e) => onDrop(shape, e)}
      onDragOver={(e) => onDragOver(shape, e)}
      // onDragExit={(e)=>onDragExit(shape,e)}
    >
      <img className={styles.icon} src={icon_shape} alt="icon_layer" />
      <div className={styles.type}>{shapeTypeToName(shape.ty)}</div>
      <div className={styles.name}>{shape.nm}</div>
    </div>
  );
};

export default BuilderShapeLayer;
