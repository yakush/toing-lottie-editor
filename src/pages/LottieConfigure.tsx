import { useLottieStore } from "../lib/lottie/app";
import LottieTree from "../lib/lottie/builder/components/LottieTree";
import { createPublicLottieSampleUrl } from "../utils/paths";

type Props = {};

export default function LottieConfigure({}: Props) {
  const lottie = useLottieStore((state) => state.lottie);
  const edits = useLottieStore((state) => state.edits);
  const isLottieLoading = useLottieStore((store) => store.isLoading);
  const errorLoading = useLottieStore((store) => store.errorLoading);

  const loadUrl = useLottieStore((store) => store.loadUrl);

  return (
    <div>
      <h1> LottieConfigure</h1>
      <button
        onClick={() => {
          const path = createPublicLottieSampleUrl("test-text.json");
          loadUrl(path);
        }}
      >
        LOAD
      </button>
      <div>
        {isLottieLoading && <div>LOADING...</div>}
        {errorLoading && <div>{errorLoading}</div>}

        {/* <pre>{lottie ? JSON.stringify(lottie, null, 2) : "no lottie"}</pre> */}
        <LottieTree />

        <pre>{edits ? JSON.stringify(edits, null, 2) : "no edits"}</pre>
      </div>
    </div>
  );
}
