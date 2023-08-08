import { Layer } from "../../../types";
import { LayerProps } from "../../../modules/lottieLayersUiModule";
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
