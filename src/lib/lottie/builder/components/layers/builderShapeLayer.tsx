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

const BuilderShapeLayer = ({ layer }: LayerProps<ShapeLayer>) => {
  return (
    <div className={styles.root}>
      <ShapeList shapes={layer.shapes}>
        <LayerTitle layer={layer} />        
      </ShapeList>
    </div>
  );
};

type ShapeListProps = {
  shapes?: Shape[];
  children?: React.ReactNode;
};

const ShapeList = ({ children, shapes }: ShapeListProps) => {
  // const shapeAsGroup =
  //   shape.ty === shapeTypes.group ? (shape as GroupShape) : undefined;

  return (
    <List lineColor="slateblue">
      <ListHeader>{children}</ListHeader>

      {shapes?.map((shape, i) => {
        const shapeIsGroup = shape.ty === shapeTypes.group;
        const subShapes = shapeIsGroup ? (shape as GroupShape).it : undefined;

        return (
          <ShapeList key={i} shapes={subShapes}>
            {shapeTypeToName(shape.ty)} {shape.nm && `: (${shape.nm})`}
          </ShapeList>
        );
      })}
    </List>
  );
};

export default BuilderShapeLayer;