import LottiePlayer from "../lib/lottie/components/LottiePlayer";
import LottieBuilder from "../lib/lottie/components/builder/LottieBuilder";
import LottieJson from "../lib/lottie/components/builder/LottieJson";
import LottieEditor from "../lib/lottie/components/editor/LottieEditor";
import Card from "../lib/lottie/components/ui/Card";
import CardHeader from "../lib/lottie/components/ui/CardHeader";

import { DragAndDropStoreProvider } from "../lib/lottie/stores/DragAndDropStore";
import styles from "./LottieConfigure.module.css";

type Props = {};

export default function LottieConfigurePage({}: Props) {
  return (
    <DragAndDropStoreProvider>
      {/* <LottieStoreProvider> */}
      <Page />
      {/* </LottieStoreProvider> */}
    </DragAndDropStoreProvider>
  );
}

function Page({}: Props) {
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.tree}>
          <Card>
            <CardHeader>tree</CardHeader>
            <LottieJson />
          </Card>
        </div>
        <div className={styles.player}>
          <Card>
            <CardHeader>player</CardHeader>

            <LottiePlayer controls />
          </Card>
          {/* <Card>
            <CardHeader>test</CardHeader>
         
            <Test></Test>
          </Card> */}
        </div>

        <div className={styles.edits}>
          <div className={styles.builder}>
            <Card>
              <CardHeader>builder</CardHeader>

              <LottieBuilder />
            </Card>
          </div>
          <div className={styles.editor}>
            <Card>
              <CardHeader>editor</CardHeader>
              <LottieEditor />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
