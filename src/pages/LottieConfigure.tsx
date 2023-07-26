import Card from "../components/Card";
import { useLottieStore } from "../lib/lottie/app";
import LottieJson from "../lib/lottie/builder/components/LottieJson";
import LottieTree from "../lib/lottie/builder/components/LottieLayersTree";
import { createPublicLottieSampleUrl } from "../utils/paths";
import styles from "./LottieConfigure.module.css";
type Props = {};

export default function LottieConfigure({}: Props) {
  const lottie = useLottieStore((state) => state.lottie);
  const edits = useLottieStore((state) => state.edits);
  const isLottieLoading = useLottieStore((store) => store.isLoading);
  const errorLoading = useLottieStore((store) => store.errorLoading);

  const loadUrl = useLottieStore((store) => store.loadUrl);

  const files = [
    "___OLD___137141-sample.json",
    "102708-sangoma.json",
    "111228-skilltonblack.json",
    "137141-sample.json",
    "138116-sample-again.json",
    "comp-1.json",
    "test-text.json",
  ];

  return (
    <div className={styles.root}>
      <div className={styles.loader}>
        {files.map((file) => (
          <button
            key={file}
            onClick={() => {
              const path = createPublicLottieSampleUrl(file);
              loadUrl(path);
            }}
          >
            {file}
          </button>
        ))}
      </div>

      <div className={styles.messages}>
        {isLottieLoading && <div>LOADING...</div>}
        {errorLoading && <div>{errorLoading}</div>}
      </div>

      <div className={styles.builder}>
        <Card>
          <LottieJson />
        </Card>
      </div>
      <div className={styles.player}>
        <Card>player</Card>
      </div>
      <div className={styles.editor}>
        <Card>
          <pre>{edits ? JSON.stringify(edits, null, 2) : "no edits"}</pre>
        </Card>
      </div>
    </div>
  );
}
