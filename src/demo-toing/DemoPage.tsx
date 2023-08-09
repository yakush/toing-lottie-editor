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
import { saveFile, uploadToServer } from "./utils";

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
        <button style={{ flex: 1 }} onClick={() => setDemo("display")}>
          display
        </button>
        <button style={{ flex: 1 }} onClick={() => setDemo("editor")}>
          editor
        </button>
        <button style={{ flex: 1 }} onClick={() => setDemo("builder")}>
          builder
        </button>
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

      const { src, campaign, config, execution } = toingData;

      try {
        const blob = await createGif({
          src,
          config,
          execution,
          campaign,

          //width: 200, //<= omit one of the dimensions to auto calc according to the aspect ratio
          height: 200,

          progressCallback: (progress) => setRenderGifProgress(progress),
        });

        await saveFile(blob, "toing.gif");
        //await uploadToServer(blob,"toing.gif","http://localhost:3001/api/upload");

        setIsRenderingGif(false);
        setRenderGifProgress(100);
      } catch (error) {
        console.warn(error);
        setIsRenderingGif(false);
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
