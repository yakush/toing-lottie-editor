import { SolidLayer } from "../../../types";
import { LayerProps } from "../../../modules/lottieLayersUiModule";
import LayerTitle from "../LayerTitle";

const BuilderSolidLayer = ({ layer }: LayerProps<SolidLayer>) => {
  const color = layer.sc;

  return (
    <>
      <LayerTitle layer={layer}>
        <div>color:{color}</div>
        {/* text {JSON.stringify(layer)} */}
      </LayerTitle>
    </>
  );
};

export default BuilderSolidLayer;
