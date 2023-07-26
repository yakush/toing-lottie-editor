import { ShapeLayer } from "../../../core";
import { LayerProps } from "../../builderUiModule";
import LayerTitle from "../LayerTitle";

const BuilderShapeLayer = ({ layer }: LayerProps<ShapeLayer>) => {
  return (
    <>
      <LayerTitle layer={layer} />
      <div>{layer.shapes?.length} shapes</div>
      {/* text {JSON.stringify(layer)} */}
    </>
  );
};

export default BuilderShapeLayer;
