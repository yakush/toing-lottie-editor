import LottieLayersTree from "../builder/LottieLayersTree";
import { LayerProps } from "../../modules/lottieLayersUiModule";
import useToingStore from "../../stores/ToingStore";
import { PrecompLayer } from "../../types";
import LayerTitle from "./LayerTitle";

const BuilderPrecompLayer = ({ layer }: LayerProps<PrecompLayer>) => {
  const lottie = useToingStore((state) => state.lottie);

  const refId = layer.refId;
  const asset = lottie?.assets?.find((asset) => asset.id === refId);

  return (
    <>
      <div>
        {asset ? (
          <LottieLayersTree layers={asset.layers}>
            <LayerTitle layer={layer}>
              {asset.id} : {asset.nm ?? "untitled"}
            </LayerTitle>
          </LottieLayersTree>
        ) : (
          "ASSET NOT FOUND"
        )}
      </div>
      {/* text {JSON.stringify(layer)} */}
    </>
  );
};

export default BuilderPrecompLayer;
