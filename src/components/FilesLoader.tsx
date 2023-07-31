import { useState } from "react";
import { useLottieStore } from "../lib/lottie/app";
import Card from "../lib/lottie/app/components/Card";
import CardHeader from "../lib/lottie/app/components/CardHeader";
import { purgeEditsExecutions } from "../lib/lottie/utils/lottieUtils";
import { useEffectOnChanged } from "../lib/lottie/utils/useEffectOnUpdate";
import FileDropTarget from "./FileDropTarget";
import styles from "./FilesLoader.module.css";
import { createPublicLottieSampleUrl } from "../utils/paths";
import PopOver from "./PopOver";

const files = [
  { name: "---" },
  { name: "SAMPLE 1.json", edits: "SAMPLE 1.edits.json" },
  { name: "SAMPLE 1.json", edits: "" },
  { name: "OLD.json", edits: "OLD.edits.json" },
  { name: "102708-sangoma.json", edits: "" },
  { name: "111228-skilltonblack.json", edits: "" },
  { name: "138116-sample-again.json", edits: "" },
  { name: "comp-1.json", edits: "" },
  { name: "test-text.json", edits: "" },
];

type Props = {};

export default function FilesLoader({}: Props) {
  const [loaderSelectedIdx, setLoaderSelectedIdx] = useState(0);
  const [loadedLottieFile, setLoadedLottieFile] = useState<File>();
  const [loadedEditsFile, setLoadedEditsFile] = useState<File>();
  const [purgedEditsText, setPurgedEditsText] = useState("");

  const [showPopup, setShowPopup] = useState(false);

  const isLottieLoading = useLottieStore((store) => store.isLoading);
  const errorLoading = useLottieStore((store) => store.errorLoading);
  const edits = useLottieStore((state) => state.edits);
  const loadFile = useLottieStore((state) => state.loadFile);
  const loadUrl = useLottieStore((store) => store.loadUrl);

  useEffectOnChanged(() => {
    loadSelectedUrl();
  }, [loaderSelectedIdx]);

  useEffectOnChanged(() => {
    const json = edits && purgeEditsExecutions(edits);
    setPurgedEditsText(JSON.stringify(json, null, 2));
  }, [edits]);

  const exportEdits = () => {
    console.log(purgedEditsText);
    setShowPopup(true);
  };

  function copyEditsToClipboard() {
    navigator.clipboard.writeText(purgedEditsText);
  }

  async function saveEditsToFile() {
    const json = edits && purgeEditsExecutions(edits);
    const text = JSON.stringify(json, null, 2);

    const filename = "test.edits.json";
    const blob = new Blob([text]);
    const msSaveOrOpenBlob = (window.navigator as any)["msSaveOrOpenBlob"];
    if (msSaveOrOpenBlob)
      // IE10+
      msSaveOrOpenBlob(blob, filename);
    else {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
    }
  }

  const loadLottieFile = (file: File) => {
    setLoaderSelectedIdx(0);
    setLoadedLottieFile(file);
    setLoadedEditsFile(undefined);
    loadFile(file);
  };
  const loadEditsFile = (file: File) => {
    if (!loadedLottieFile) {
      return;
    }
    setLoadedEditsFile(file);
    loadFile(loadedLottieFile, file);
  };
  const loadSelectedUrl = () => {
    if (loaderSelectedIdx === 0) {
      return;
    }

    setLoadedLottieFile(undefined);
    setLoadedEditsFile(undefined);

    const file = files[loaderSelectedIdx];
    if (!file) {
      return;
    }
    const path = createPublicLottieSampleUrl(file.name);
    const pathEdits = !!file.edits
      ? createPublicLottieSampleUrl(file.edits)
      : undefined;
    loadUrl(path, pathEdits);
  };

  return (
    <div className={styles.loader}>
      <Card collapsed={false} smallestHeight>
        <CardHeader>LOADER</CardHeader>
        <div className={styles.loaderContent}>
          <label>select file</label>
          <select
            style={{ flex: 1 }}
            value={loaderSelectedIdx}
            onChange={(e) => setLoaderSelectedIdx(+e.target.value)}
          >
            {files.map((file, idx) => (
              <option key={file.name + file.edits} value={idx}>
                {file.name} {file.edits && " ---- [HAS EDITS JSON]"}
              </option>
            ))}
          </select>
          <div> - OR - </div>
          <div style={{ display: "flex", gap: 5 }}>
            <FileDropTarget onDrop={(fileList) => loadLottieFile(fileList[0])}>
              <div>drop lottie file here</div>
              <div style={{ fontSize: 14 }}>
                {loadedLottieFile?.name || "none"}
              </div>
            </FileDropTarget>

            <FileDropTarget onDrop={(fileList) => loadEditsFile(fileList[0])}>
              <div>drop config file here</div>
              <div style={{ fontSize: 14 }}>
                {loadedEditsFile?.name || "none"}
              </div>
            </FileDropTarget>
          </div>

          <button style={{ alignSelf: "stretch" }} onClick={exportEdits}>
            export edits json <br /> to clipboard
          </button>
        </div>
      </Card>

      <div className={styles.messages}>
        {isLottieLoading && <div>LOADING...</div>}
        {errorLoading && <div>{errorLoading}</div>}
      </div>

      <PopOver show={showPopup} onClosed={() => setShowPopup(false)}>
        <div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={saveEditsToFile}>SAVE TO FILE</button>
            <button onClick={copyEditsToClipboard}>COPY TO CLIPBOARD</button>
          </div>
          <hr />
          <pre>{purgedEditsText}</pre>
        </div>
      </PopOver>
    </div>
  );
}
