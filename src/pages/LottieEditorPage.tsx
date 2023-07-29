import { useEffect } from "react";
import { LottieStoreProvider, useLottieStore } from "../lib/lottie/app";
import LottieEditor from "../lib/lottie/app/components/LottieEditor";
import { createPublicLottieSampleUrl } from "../utils/paths";
import styles from "./LottieEditorPage.module.css";
import LottiePlayer from "../lib/lottie/app/components/LottiePlayer";
import Card from "../lib/lottie/app/components/Card";

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
