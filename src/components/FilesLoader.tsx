import { useState } from "react";
import { useLottieStore } from "../lib/lottie/app";
import Card from "../lib/lottie/app/components/Card";
import CardHeader from "../lib/lottie/app/components/CardHeader";
import { useEffectOnChanged } from "../lib/lottie/utils/useEffectOnUpdate";
import FileDropTarget from "./FileDropTarget";
import styles from "./FilesLoader.module.css";
import { createPublicLottieSampleUrl } from "../utils/paths";
import PopOver from "./PopOver";
import { LottieLoader, ToingConfig } from "../lib/lottie/core";

const files = [
  { name: "---" },
  { name: "SAMPLE 1.json", config: "SAMPLE 1.config.json" },
  { name: "SAMPLE 1.json", config: "" },
  { name: "OLD.json", config: "OLD.config.json" },
  { name: "102708-sangoma.json", config: "" },
  { name: "111228-skilltonblack.json", config: "" },
  { name: "138116-sample-again.json", config: "" },
  { name: "comp-1.json", config: "" },
  { name: "test-text.json", config: "" },
];

type Props = {};

export default function FilesLoader({}: Props) {
  const [loaderSelectedIdx, setLoaderSelectedIdx] = useState(0);
  const [loadedLottieFile, setLoadedLottieFile] = useState<File>();
  const [loadedConfigFile, setLoadedConfigFile] = useState<File>();

  const [showPopup, setShowPopup] = useState(false);

  const isLottieLoading = useLottieStore((store) => store.isLoading);
  const errorLoading = useLottieStore((store) => store.errorLoading);
  const loadFile = useLottieStore((state) => state.loadFile);
  const loadUrl = useLottieStore((store) => store.loadUrl);
  const config = useLottieStore((state) => state.config);
  const setConfig = useLottieStore((store) => store.setConfig);
  const setExecutions = useLottieStore((store) => store.setExecutions);
  const setCampaign = useLottieStore((store) => store.setCampaign);

  useEffectOnChanged(() => {
    loadSelectedUrl();
  }, [loaderSelectedIdx]);

  const exportEdits = () => {
    const text = JSON.stringify(config, null, 2);
    console.log(text);
    setShowPopup(true);
  };

  function copyEditsToClipboard() {
    const text = JSON.stringify(config, null, 2);
    navigator.clipboard.writeText(text);
  }

  async function saveEditsToFile() {
    const text = JSON.stringify(config, null, 2);

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
    setLoadedConfigFile(undefined);
    loadFile(file);
    setConfig(undefined);
    setExecutions(undefined);
    setCampaign(undefined);
  };

  const loadConfigFile = (file: File) => {
    if (!loadedLottieFile) {
      return;
    }
    setLoadedConfigFile(file);

    async function load() {
      const loader = new LottieLoader<ToingConfig>();
      const res = await loader.loadFile(file);
      setConfig(res);
      setExecutions(undefined);
      setCampaign(undefined);
    }
    load();
  };

  const loadSelectedUrl = () => {
    if (loaderSelectedIdx === 0) {
      return;
    }

    setLoadedLottieFile(undefined);
    setLoadedConfigFile(undefined);
    setExecutions(undefined);
    setCampaign(undefined);

    const file = files[loaderSelectedIdx];
    if (!file) {
      return;
    }

    async function load() {
      const path = createPublicLottieSampleUrl(file.name);
      const pathConfig = !!file.config
        ? createPublicLottieSampleUrl(file.config)
        : undefined;

      console.log("loading lottie: ", path);
      await loadUrl(path);

      if (pathConfig) {
        console.log("loading config: ", pathConfig);
        const configLoader = new LottieLoader<ToingConfig>();
        const res = await configLoader.loadUrl(pathConfig);
        setConfig(res);
      } else {
        setConfig(undefined);
      }
    }

    load();
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
              <option key={file.name + file.config} value={idx}>
                {file.name} {file.config && " ---- [HAS config JSON]"}
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

            <FileDropTarget onDrop={(fileList) => loadConfigFile(fileList[0])}>
              <div>drop config file here</div>
              <div style={{ fontSize: 14 }}>
                {loadedConfigFile?.name || "none"}
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
          <pre>{JSON.stringify(config, null, 2)}</pre>
        </div>
      </PopOver>
    </div>
  );
}
