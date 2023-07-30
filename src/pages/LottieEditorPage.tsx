import Card from "../lib/lottie/app/components/Card";
import LottieEditor from "../lib/lottie/app/components/LottieEditor";
import LottiePlayer from "../lib/lottie/app/components/LottiePlayer";
import styles from "./LottieEditorPage.module.css";

type Props = {};

export default function LottieEditorPage({}: Props) {
  return (
    // <LottieStoreProvider>
    <Page />
    // </LottieStoreProvider>
  );
}

function Page({}: Props) {
  // const loadUrl = useLottieStore((state) => state.loadUrl);
  // useEffect(() => {
  //   async function fetchData() {
  //     const file = { name: "SAMPLE 1.json", edits: "SAMPLE 1.edits.json" };
  //     await loadUrl(
  //       createPublicLottieSampleUrl(file.name),
  //       createPublicLottieSampleUrl(file.edits)
  //     );
  //     console.log("done");
  //   }
  //   fetchData();
  // }, [loadUrl]);
  
  return (
    <div className={styles.root}>
      <div className={styles.edits}>
        <Card>
          <LottieEditor />
        </Card>
      </div>

      <div className={styles.player}>
        <Card>
          <LottiePlayer />
        </Card>
      </div>
    </div>
  );
}
