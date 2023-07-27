import { Layer } from "../../../core";
import { LayerProps } from "../../builderUiModule";
import LayerTitle from "../LayerTitle";

const BuilderUnknownLayer = ({ layer }: LayerProps<Layer>) => {
  return (
    <>
      <LayerTitle layer={layer}>
        <div>UNKNOWN LAYER (ty={layer.ty})</div>
      </LayerTitle>
      {/* text {JSON.stringify(layer)} */}
    </>
  );
};

export default BuilderUnknownLayer;
