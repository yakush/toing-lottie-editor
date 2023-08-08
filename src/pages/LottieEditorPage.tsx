import Card from "../lib/lottie/components/Card";
import LottieEditor from "../lib/lottie/components/LottieEditor";
import LottiePlayer from "../lib/lottie/components/LottiePlayer";
import useToingStore from "../lib/lottie/stores/ToingStore";
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
  // const loadUrl = useToingStore((state) => state.loadUrl);
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
  const userExecutions = useToingStore((state) => state.userExecutions);

  return (
    <div className={styles.root}>
      <div className={styles.edits}>
        <Card>
          <LottieEditor />
        
        </Card>
      </div>

      <div className={styles.player}>
        <Card>
          <LottiePlayer controls />
          {/* <pre>{JSON.stringify(userExecutions, null, 2)}</pre> */}
        </Card>
      </div>
    </div>
  );
}
