import { useState } from "react";
import {
  ToingBuilder,
  ToingConfig,
  ToingData,
  ToingDebug,
  ToingDisplay,
  ToingEditor,
  ToingUserExecutions,
  createGif,
} from "../lib/lottie";
import DemoLoader from "./DemoLoader";
import styles from "./DemoPage.module.css";

type Props = {};
type demoType = "display" | "editor" | "builder";

export default function DemoPage({}: Props) {
  const [demo, setDemo] = useState<demoType>("display");
  const [toingData, setToingData] = useState<ToingData>();

  const onExportExecution = (execution: ToingUserExecutions) => {
    console.log(JSON.stringify(execution, null, 2));
    setToingData((data) => {
      return (
        data && {
          ...data,
          execution,
        }
      );
    });
  };

  const onExportConfig = (config: ToingConfig) => {
    console.log(JSON.stringify(config, null, 2));
    setToingData((data) => {
      return (
        data && {
          ...data,
          config,
        }
      );
    });
  };

  return (
    <div className={styles.root}>
      <DemoLoader onLoadedData={setToingData} />

      <div className={styles.demoSelect}>
        <button style={{flex:1}} onClick={() => setDemo("display")}>display</button>
        <button style={{flex:1}} onClick={() => setDemo("editor")}>editor</button>
        <button style={{flex:1}} onClick={() => setDemo("builder")}>builder</button>
      </div>
      <div className={styles.demoContent}>
        {demo === "display" && <DemoDisplay toingData={toingData} />}
        {demo === "editor" && (
          <DemoEditor
            onExportExecution={onExportExecution}
            toingData={toingData}
          />
        )}
        {demo === "builder" && (
          <DemoBuilder onExportConfig={onExportConfig} toingData={toingData} />
        )}
        <hr />
        {toingData && <ToingDebug toingData={toingData} />}
      </div>
    </div>
  );
}

//-------------------------------------------------------

function DemoDisplay({ toingData }: { toingData?: ToingData }) {
  const [isRenderingGif, setIsRenderingGif] = useState(false);
  const [renderGifProgress, setRenderGifProgress] = useState(0);

  async function saveGif() {
    if (toingData) {
      setIsRenderingGif(true);
      setRenderGifProgress(0);

      try {
        const blob = await createGif({
          src: toingData.src,
          //width: 200,
          height: 200,
          config: toingData.config,
          execution: toingData.execution,
          campaign: toingData.campaign,
          // campaign: {
          //   ...default_ToingCampaign,
          //   logoUrl: createPublicUrl("logo192.png"),
          // },
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

  return (
    <div className={styles.DemoDisplay}>
      {!toingData && "no data"}
      {toingData && (
        <div className={styles.content}>
          <div className={styles.display}>
            <ToingDisplay toingData={toingData} />
          </div>
          <button onClick={() => saveGif()} disabled={isRenderingGif}>
            render to gif{" "}
            {isRenderingGif && (
              <>
                <br />
                {Math.round(renderGifProgress * 100) + "%"}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

//-------------------------------------------------------

function DemoEditor({
  toingData,
  onExportExecution,
}: {
  toingData?: ToingData;
  onExportExecution?: (execution: ToingUserExecutions) => void;
}) {
  return (
    <div className={styles.DemoEditor}>
      {!toingData && "no data"}
      {toingData && (
        <ToingEditor
          onExportExecution={onExportExecution}
          toingData={toingData}
        />
      )}
    </div>
  );
}

//-------------------------------------------------------

function DemoBuilder({
  toingData,
  onExportConfig,
}: {
  toingData?: ToingData;
  onExportConfig?: (config: ToingConfig) => void;
}) {
  return (
    <div className={styles.DemoBuilder}>
      {!toingData && "no data"}
      {toingData && (
        <ToingBuilder onExportConfig={onExportConfig} toingData={toingData} />
      )}
    </div>
  );
}
