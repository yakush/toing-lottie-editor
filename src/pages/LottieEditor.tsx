import { LottieLayer, builderUiModule } from "../lib/lottie/builder";
import { layerTypes } from "../lib/lottie/core";

let test = {
  layers: [
    { ind: 1, ty: layerTypes.shape, shapes: [{}, {}, {}] },
    { ind: 2, ty: layerTypes.audio },
    { ind: 3, ty: layerTypes.audio },
    { ind: 4, ty: layerTypes.shape },
    { ind: 5, ty: layerTypes.camera },
    { ind: 6, ty: layerTypes.camera },
    { ind: 7, ty: layerTypes.audio },
    { ind: 8, ty: layerTypes.text },
    { ind: 9, ty: layerTypes.text },
    { ind: 10, ty: layerTypes.camera },
  ],
};

const LottieEditor = () => {
  return (
    <div>
      LottieEditor layer:
      {test.layers
        ?.filter((layer) => builderUiModule.layers.has(layer.ty))
        .map((layer, i) => (
          <div>
            [{i}] <LottieLayer layer={layer}></LottieLayer>
          </div>
        ))}
    </div>
  );
};

export default LottieEditor;
