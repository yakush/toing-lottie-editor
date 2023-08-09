import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useEffect, useId, useState } from "react";

import {
  ToingBuilder,
  ToingDebug,
  ToingDisplay,
  ToingEditor,
  createGif,
} from "../lib/lottie";
import styles from "./DemoPageJS.module.css";

//-------------------------------------------------------
//- demo page for toing and lottie files
//-------------------------------------------------------
export default function DemoPageJs() {
  const [demo, setDemo] = useState("display");
  const [toingData, setToingData] = useState();

  const onExportExecution = (execution) => {
    console.log(JSON.stringify(execution ?? {}, null, 2));
    setToingData((data) => data && { ...data, execution });
  };

  const onExportConfig = (config) => {
    console.log(JSON.stringify(config ?? {}, null, 2));
    setToingData((data) => data && { ...data, config });
  };

  return (
    <div className={styles.rootDemoPage}>
      <DemoLoader onLoadedData={setToingData} />

      <Card variant="elevation">
        <CardContent>
          {/* TABS */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={demo}
              onChange={(event, value) => {
                setDemo(value);
              }}
              aria-label="tabs"
            >
              <Tab label="display" value="display" />
              <Tab label="editor" value="editor" />
              <Tab label="builder" value="builder" />
              <Tab label="debug" value="debug" />
            </Tabs>
          </Box>

          {/* CONTENT */}
          <div className={styles.demoContent}>
            {demo === "display" && (
              <DemoDisplay toingData={toingData}></DemoDisplay>
            )}
            {demo === "editor" && (
              <DemoEditor
                onExportExecution={onExportExecution}
                toingData={toingData}
              ></DemoEditor>
            )}
            {demo === "builder" && (
              <DemoBuilder
                onExportConfig={onExportConfig}
                toingData={toingData}
              ></DemoBuilder>
            )}
            {demo === "debug" && (
              <DemoDebug toingData={toingData}></DemoDebug>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

//-------------------------------------------------------
//-------------------------------------------------------
//-------------------------------------------------------

function DemoDisplay({ toingData }) {
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
          quality: 2,

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

function DemoEditor({ toingData, onExportExecution }) {
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

function DemoBuilder({ toingData, onExportConfig }) {
  return (
    <div className={styles.DemoBuilder}>
      {!toingData && "no data"}
      {toingData && (
        <ToingBuilder onExportConfig={onExportConfig} toingData={toingData} />
      )}
    </div>
  );
}

function DemoDebug({ toingData }) {
  return (
    <div className={styles.DemoDebug}>
      {!toingData && "no data"}
      {toingData && <ToingDebug toingData={toingData} />}
    </div>
  );
}

//-------------------------------------------------------

function DemoLoader({ onLoadedData }) {
  const [minimized, setMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState();

  const [src_source, setSrc_source] = useState();
  const [config_source, setConfig_source] = useState();
  const [campaign_source, setCampaign_source] = useState();
  const [execution_source, setExecution_source] = useState();

  async function getSource(src) {
    if (src == null) {
      return src;
    }

    //-------------------------------------------------------
    if (src instanceof File) {
      return await readFileHelper(src);
    }

    //-------------------------------------------------------

    if (typeof src === "object") {
      return src;
    }

    if (typeof src === "string") {
      try {
        return JSON.parse(src);
      } catch (error) {
        //do nothing
      }

      try {
        return await (await fetch(src)).json();
      } catch (error) {
        throw error;
      }
    }

    return undefined;
  }

  async function getAllSources() {
    setIsLoading(true);
    setLoadingError(undefined);

    try {
      const src = await getSource(src_source);
      const config = await getSource(config_source);
      const campaign = await getSource(campaign_source);
      const execution = await getSource(execution_source);

      onLoadedData &&
        onLoadedData({
          src,
          campaign,
          config,
          execution,
        });
    } catch (error) {
      setLoadingError(error.toString());
    } finally {
      setIsLoading(false);
    }
  }

  function handleClear() {
    setLoadingError(undefined);
    onLoadedData && onLoadedData(undefined);
  }

  return (
    <div className={styles.rootLoader}>
      <Card variant="elevation">
        <div className={styles.loaderHeader}>
          <IconButton
            aria-label="toggle loader"
            onClick={() => setMinimized((x) => !x)}
          >
            {minimized ? <OpenInFullIcon /> : <CloseFullscreenIcon />}
          </IconButton>
          <Typography variant="h5">Loader</Typography>
        </div>
        <Collapse in={!minimized}>
          <CardContent className={styles.content}>
            <SourceBox
              title="source"
              onChangeSource={(source) => setSrc_source(source)}
            />
            <SourceBox
              title="config"
              onChangeSource={(source) => setConfig_source(source)}
            />
            <SourceBox
              title="campaign"
              onChangeSource={(source) => setCampaign_source(source)}
            />
            <SourceBox
              title="executions"
              onChangeSource={(source) => setExecution_source(source)}
            />
          </CardContent>

          <CardActions>
            <IconButton aria-label="go" onClick={getAllSources}>
              <SaveAltIcon />
            </IconButton>
            <IconButton aria-label="clear" onClick={handleClear}>
              <DeleteOutlineIcon />
            </IconButton>

            {isLoading && "loading..."}
            {loadingError}
          </CardActions>
        </Collapse>
      </Card>
    </div>
  );
}

//-------------------------------------------------------
//-------------------------------------------------------
function SourceBox({ title, defaultUrl, onChangeSource }) {
  const id = useId();
  const [file, setFile] = useState();
  const [filepath, setFilepath] = useState("");
  const [url, setUrl] = useState(defaultUrl ?? "");

  //fire event :
  useEffect(() => {
    if (!!file) {
      onChangeSource && onChangeSource(file);
    } else if (!!url) {
      onChangeSource && onChangeSource(url);
    } else {
      onChangeSource && onChangeSource(undefined);
    }
  }, [file, onChangeSource, url]);

  //updates:
  const changeUrl = (url) => {
    setFile(undefined);
    setFilepath("");
    setUrl(url);
  };
  const changeFile = (event) => {
    setFile(event.target.files && event.target.files[0]);
    setFilepath(event.target.value);
    setUrl("");
  };
  const clear = () => {
    setFile(undefined);
    setFilepath("");
    setUrl("");
  };

  //JSX
  return (
    <Card variant="outlined" className={styles.rootSourceBox}>
      <Typography className={styles.title}>{title}</Typography>

      <IconButton onClick={() => clear()}>
        <DeleteForeverIcon />
      </IconButton>

      <div className={styles.file} data-selected={!!filepath}>
        <input type="file" value={filepath} onChange={(e) => changeFile(e)} />
      </div>
      <span> -- OR -- </span>
      <div className={styles.url} data-selected={!!url}>
        <label htmlFor={`${id}-url`}>url:</label>
        <input
          id={`${id}-url`}
          type="text"
          value={url}
          onChange={(event) => changeUrl(event.target.value)}
        />
      </div>
    </Card>
  );
}

//-------------------------------------------------------
// UTIL FUNCTIONS:
//-------------------------------------------------------
async function saveFile(blob, filename) {
  const msSaveOrOpenBlob = window.navigator["msSaveOrOpenBlob"];
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
async function uploadToServer(blob, filename, url) {
  const formData = new FormData();
  formData.append("content", blob, filename);

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}

function readFileHelper(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onabort = () => {
      console.log("file reading was aborted");
      reject("file reading was aborted");
    };

    reader.onerror = () => {
      console.log("file reading has failed");
      reject("file reading has failed");
    };

    reader.onload = () => {
      try {
        const str = reader.result;
        const content = JSON.parse(str);

        resolve(content);
      } catch (err) {
        console.log("JSON parsing failed");
        reject("JSON parsing failedF");
      }
    };
    reader.readAsText(file);
  });
}

export function createPublicUrl(file) {
  return `${process.env.PUBLIC_URL}/${file}`;
}

export function createPublicLottieSampleUrl(file) {
  return createPublicUrl(`lottie-samples/${file}`);
}
