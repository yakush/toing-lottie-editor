import { useEffect } from "react";
import { LottieStoreProvider, useLottieStore } from "../lib/lottie/app";
import { LottieLayer, builderUiModule } from "../lib/lottie/builder";
import { layerTypes } from "../lib/lottie/core";
import { createPublicLottieSampleUrl } from "../utils/paths";
import LottieJson from "../lib/lottie/builder/components/LottieJson";
import LottieEditor from "../lib/lottie/app/components/LottieEditor";

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

type Props = {};

export default function LottieEditorPage({}: Props) {
  return (
    <LottieStoreProvider>
      <Page />
    </LottieStoreProvider>
  );
}

function Page({}: Props) {
  const loadUrl = useLottieStore((state) => state.loadUrl);

  useEffect(() => {
    async function fetchData() {
      const file = { name: "SAMPLE 1.json", edits: "SAMPLE 1.edits.json" };
      await loadUrl(
        createPublicLottieSampleUrl(file.name),
        createPublicLottieSampleUrl(file.edits)
      );
      console.log("done");
    }
    fetchData();
  }, [loadUrl]);
  // return <>
  // <LottieConfigure/>
  // <LottieConfigure/>
  // <LottieConfigure/>
  // </>
  return (
    <div>
     <LottieEditor />
    </div>
  );
}
