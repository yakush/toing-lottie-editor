import { useRef, useState } from "react";
import Card from "../lib/lottie/app/components/Card";
import FileDropTarget from "../components/FileDropTarget";
import { LottieStoreProvider, useLottieStore } from "../lib/lottie/app";
import LottieEditor from "../lib/lottie/app/components/LottieEditor";
import LottiePlayer from "../lib/lottie/app/components/LottiePlayer";
import LottieJson from "../lib/lottie/builder/components/LottieJson";
import { LottieRef } from "../lib/lottie/core";
import { findLayerRef, findShapeRef } from "../lib/lottie/utils/lottieUtils";
import { createPublicLottieSampleUrl } from "../utils/paths";
import styles from "./LottieConfigure.module.css";
import {
  DragAndDropStoreProvider,
  useDragAndDropSource,
  useDragAndDropTarget,
} from "../lib/lottie/app/DragAndDrop";
import LottieBuilder from "../lib/lottie/builder/components/LottieBuilder";
import CardHeader from "../lib/lottie/app/components/CardHeader";

type Props = {};

export default function LottieConfigurePage({}: Props) {
  return (
    <DragAndDropStoreProvider>
      <LottieStoreProvider>
        <Page />
      </LottieStoreProvider>
    </DragAndDropStoreProvider>
  );
}

function Page({}: Props) {
  const edits = useLottieStore((state) => state.edits);
  const isLottieLoading = useLottieStore((store) => store.isLoading);
  const errorLoading = useLottieStore((store) => store.errorLoading);
  const loadLottieFile = useLottieStore((state) => state.loadFile);

  const loadUrl = useLottieStore((store) => store.loadUrl);

  const files = [
    { name: "SAMPLE 1.json", edits: "SAMPLE 1.edits.json" },
    { name: "OLD.json", edits: "OLD.edits.json" },
    { name: "102708-sangoma.json", edits: "" },
    { name: "111228-skilltonblack.json", edits: "" },
    { name: "138116-sample-again.json", edits: "" },
    { name: "comp-1.json", edits: "" },
    { name: "test-text.json", edits: "" },
  ];

  return (
    <div className={styles.root}>
      <div className={styles.loader}>
        {files.map((file) => (
          <button
            key={file.name}
            onClick={() => {
              const path = createPublicLottieSampleUrl(file.name);
              const pathEdits = !!file.edits
                ? createPublicLottieSampleUrl(file.edits)
                : undefined;
              loadUrl(path, pathEdits);
            }}
          >
            {file.name} {file.edits && "(+)"}
          </button>
        ))}
        <FileDropTarget onDrop={(fileList) => loadLottieFile(fileList[0])}>
          drop file here
        </FileDropTarget>
      </div>

      <div className={styles.messages}>
        {isLottieLoading && <div>LOADING...</div>}
        {errorLoading && <div>{errorLoading}</div>}
      </div>

      <div className={styles.builder}>
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
        <Card>
          <CardHeader>test</CardHeader>
          {/* <pre>{edits ? JSON.stringify(edits, null, 2) : "no edits"}</pre> */}
          <Test></Test>
        </Card>
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

      <div ref={refSource1}>from 1</div>
      <div ref={refSource2}>from 2</div>
      <div ref={refTarget1}>to 1</div>
      <div>to 2</div>
    </>
  );
}
