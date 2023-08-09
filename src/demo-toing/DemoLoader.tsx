import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";

import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
  Typography,
} from "@mui/material";
import {
  ToingData,
  default_ToingCampaign,
  default_ToingConfig,
  default_ToingUserExecutions,
} from "../lib/lottie";

import styles from "./DemoLoader.module.css";
import { createPublicLottieSampleUrl, readFileHelper } from "./utils";
import { useState } from "react";
import SourceBox from "./SourceBox";

type sourceType = string | object | undefined;

type Props = {
  onLoadedData?: (toingData: ToingData | undefined) => void;
};

const DemoLoader = ({ onLoadedData }: Props) => {
  const [minimized, setMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState();

  const [src_source, setSrc_source] = useState<sourceType>();
  const [config_source, setConfig_source] = useState<sourceType>();
  const [campaign_source, setCampaign_source] = useState<sourceType>();
  const [execution_source, setExecution_source] = useState<sourceType>();

  async function getSource(src: any) {
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
    } catch (error: any) {
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
    <div className={styles.root}>
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
              defaultUrl={createPublicLottieSampleUrl("SAMPLE 1.json")}
              onChangeSource={(source) => setSrc_source(source)}
            />
            <SourceBox
              title="config"
              defaultUrl={createPublicLottieSampleUrl("SAMPLE 1.config.json")}
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
};
export default DemoLoader;
