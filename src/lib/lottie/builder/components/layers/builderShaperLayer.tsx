import { ShapeLayer } from "../../../core";
import { LayerProps } from "../../builderUiModule";

const BuilderShapeLayer = ({ layer }: LayerProps<ShapeLayer>) => {
  return (
    <>
      shape ({layer.shapes?.length}) {JSON.stringify(layer)}
    </>
  );
};

export default BuilderShapeLayer;