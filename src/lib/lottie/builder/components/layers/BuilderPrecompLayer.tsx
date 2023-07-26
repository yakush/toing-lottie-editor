import { useLottieStore } from "../../../app";
import { PrecompLayer } from "../../../core";
import { LayerProps } from "../../builderUiModule";
import LayerTitle from "../LayerTitle";
import LottieLayer from "../lottieLayer";

const BuilderPrecompLayer = ({ layer }: LayerProps<PrecompLayer>) => {
  const lottie = useLottieStore((state) => state.lottie);

  const refId = layer.refId;
  const asset = lottie?.assets?.find((asset) => asset.id === refId);

  return (
    <>
      <LayerTitle layer={layer}/>
      
      <div>ref id: {refId}</div>
      <div>
        {asset ? (
          <div>
            <ul>
              <li>{asset.id}</li>
              <li>{asset.nm ?? "untitled"}</li>
              <li>{asset.layers?.length ?? "no layers"}</li>
            </ul>

            <ol>
              {asset?.layers?.map((layer) => (
                <li key={layer.ind}>
                  <LottieLayer layer={layer} />
                </li>
              ))}
            </ol>
          </div>
        ) : (
          "ASSET NOT FOUND"
        )}
      </div>
      {/* text {JSON.stringify(layer)} */}
    </>
  );
};

export default BuilderPrecompLayer;
