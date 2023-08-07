import { useState } from "react";
import { useLottieStore } from "../lib/lottie/app";
import Card from "../lib/lottie/app/components/Card";
import CardHeader from "../lib/lottie/app/components/CardHeader";
import { useEffectOnChanged } from "../lib/lottie/utils/useEffectOnUpdate";
import FileDropTarget from "./FileDropTarget";
import styles from "./FilesLoader.module.css";
import { createPublicLottieSampleUrl, createPublicUrl } from "../utils/paths";
import PopOver from "./PopOver";
import {
  LottieLoader,
  ToingConfig,
  default_ToingCampaign,
} from "../lib/lottie/core";
import { createGif } from "../lib/lottie";

const files = [
  { name: "---" },
  { name: "SAMPLE 1.json", config: "SAMPLE 1.config.json" },
  { name: "SAMPLE 1.json", config: "" },
  { name: "OLD.json", config: "" },
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
  const [isRenderingGif, setIsRenderingGif] = useState(false);
  const [renderGifProgress, setRenderGifProgress] = useState(0);

  const [showPopup, setShowPopup] = useState(false);

  const isLottieLoading = useLottieStore((store) => store.isLoading);
  const errorLoading = useLottieStore((store) => store.errorLoading);
  const loadFile = useLottieStore((state) => state.loadFile);
  const loadUrl = useLottieStore((store) => store.loadUrl);
  const lottie = useLottieStore((state) => state.lottie);
  const config = useLottieStore((state) => state.config);
  const userExecutions = useLottieStore((state) => state.userExecutions);
  const campaign = useLottieStore((state) => state.campaign);
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

  async function saveGif() {
    if (lottie) {
      setIsRenderingGif(true);
      setRenderGifProgress(0);

      try {
        const blob = await createGif({
          src: JSON.stringify(lottie),
          //width: 200,
          height: 200,
          config,
          execution: userExecutions,
          campaign: {
            ...default_ToingCampaign,
            logoUrl: createPublicUrl("logo192.png"),
          },
          progressCallback: (progress) => {
            setRenderGifProgress(progress);
          },
        });

        await saveFile(blob);
        setIsRenderingGif(false);
        setRenderGifProgress(100);
      } catch (error) {
        console.warn(error);
        setIsRenderingGif(false);
      }
    }

    async function saveFile(blob: Blob) {
      const filename = "test.gif";
      const msSaveOrOpenBlob = (window.navigator as any)["msSaveOrOpenBlob"];
      if (msSaveOrOpenBlob)
        // IE10+
        msSaveOrOpenBlob(blob, filename);
      else {
        // Others
        const a = document.createElement("a");
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 0);
      }
    }

    //upload to server:
    async function uploadToServer(blob: Blob) {
      const formData = new FormData();
      formData.append("content", blob, "test.gif");

      try {
        const response = await fetch("http://localhost:3001/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        console.log(data);
      } catch (err) {
        console.error(err);
      }
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
          <button
            style={{ alignSelf: "stretch", width: 70 }}
            onClick={saveGif}
            disabled={isRenderingGif}
          >
            save gif
            {isRenderingGif && (
              <>
                <br />
                {Math.round(renderGifProgress * 100) + "%"}
              </>
            )}
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
