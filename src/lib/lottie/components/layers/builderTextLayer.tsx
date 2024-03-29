import { LayerProps } from "../../modules/lottieLayersUiModule";
import { TextLayer } from "../../types";
import LayerTitle from "./LayerTitle";

const BuilderTextLayer = ({ layer }: LayerProps<TextLayer>) => {
  const keys = layer.t?.d?.k;
  const text = keys ? keys[0]?.s?.t : "";

  return (
    <>
      <LayerTitle layer={layer} />
      <div>{text}</div>
      {/* text {JSON.stringify(layer)} */}
    </>
  );
};

export default BuilderTextLayer;
