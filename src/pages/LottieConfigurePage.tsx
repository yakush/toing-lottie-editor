import { useRef, useState } from "react";
import { useLottieStore } from "../lib/lottie/app";
import {
  DragAndDropStoreProvider,
  useDragAndDropSource,
  useDragAndDropTarget,
} from "../lib/lottie/app/DragAndDrop";
import Card from "../lib/lottie/app/components/Card";
import CardHeader from "../lib/lottie/app/components/CardHeader";
import LottieEditor from "../lib/lottie/app/components/LottieEditor";
import LottiePlayer from "../lib/lottie/app/components/LottiePlayer";
import LottieBuilder from "../lib/lottie/builder/components/LottieBuilder";
import LottieJson from "../lib/lottie/builder/components/LottieJson";
import RefListSelector from "../lib/lottie/builder/components/RefListSelector";
import { LottieRef } from "../lib/lottie/core";
import { findLayerRef, findShapeRef } from "../lib/lottie/utils/lottieUtils";
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

            <LottiePlayer />
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

function Test() {
  const lottie = useLottieStore((s) => s.lottie);
  const blinkLayer = useLottieStore((s) => s.blinkLayer);
  const blinkShape = useLottieStore((s) => s.blinkShape);

  const [text, setText] = useState(() => {
    const ref: LottieRef = {
      type: "layer",
      layerInd: 1,
      assetId: "55",
    };
    return JSON.stringify(ref, null, 2);
  });

  const onclick = () => {
    try {
      if (!lottie) {
        console.log("no json");
        return;
      }
      const ref: LottieRef = JSON.parse(text);
      console.log(ref);

      if (ref.type === "layer") {
        const target = findLayerRef(lottie, ref);
        !target && console.log("not found");
        target && blinkLayer(target);
      }

      if (ref.type === "shape") {
        const target = findShapeRef(lottie, ref);
        !target && console.log("not found");
        target && blinkShape(target);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const refSource1 = useRef(null);
  const refSource2 = useRef(null);
  const refTarget1 = useRef(null);
  const refTarget2 = useRef(null);
  useDragAndDropSource(refSource1, true, "1");
  useDragAndDropSource(refSource2, true, "2");
  useDragAndDropTarget(refTarget1, true, "1");
  useDragAndDropTarget(refTarget2, true, "2");

  return (
    <>
      <div>
        <textarea
          ref={refTarget2}
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ minHeight: 100 }}
        />
        <button onClick={onclick}>go</button>
      </div>

      <RefListSelector disableShape />

      <div ref={refSource1}>from 1</div>
      <div ref={refSource2}>from 2</div>
      <div ref={refTarget1}>to 1</div>
      <div>to 2</div>
    </>
  );
}
