import { useLottieStore } from "../../../app";
import { PrecompLayer } from "../../../core";
import { LayerProps } from "../../builderUiModule";
import LayerTitle from "../LayerTitle";
import LottieLayersTree from "../LottieLayersTree";
import LottieLayer from "../lottieLayer";
import styles from "./BuilderPrecompLayer.module.css";

const BuilderPrecompLayer = ({ layer }: LayerProps<PrecompLayer>) => {
  const lottie = useLottieStore((state) => state.lottie);

  const refId = layer.refId;
  const asset = lottie?.assets?.find((asset) => asset.id === refId);

  return (
    <>
      <div>
        {asset ? (
          <LottieLayersTree layers={asset.layers}>
            <LayerTitle layer={layer} >
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
