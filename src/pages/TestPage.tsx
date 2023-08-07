import { useState } from "react";
import { ToingDisplay } from "../lib/lottie";
import styles from "./TestPage.module.css";
import Card from "../lib/lottie/app/components/Card";
import { createPublicLottieSampleUrl } from "../utils/paths";
import {
  LottieLoader,
  ToingCampaign,
  ToingConfig,
  ToingUserExecutions,
} from "../lib/lottie/core";
import { resolveSrcToObject } from "../lib/lottie/utils/path";

type Props = {};
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

export default function TestPage({}: Props) {
  return <Page />;
}

function Page({}: Props) {
  const [src, setSrc] = useState("");
  const [config, setConfig] = useState<ToingConfig>();
  const [executions, setExecutions] = useState<ToingUserExecutions>();
  const [campaign, setCampaign] = useState<ToingCampaign>();

  async function onClick(name: string, config?: string) {
    setConfig(undefined);
    setExecutions({executions:{}});
    // setCampaign(undefined);

    setSrc(createPublicLottieSampleUrl(name));

    if (config) {
      const configJson = await resolveSrcToObject<ToingConfig>(
        createPublicLottieSampleUrl(config)
      );
      setConfig(configJson);
    } else {
      setConfig(undefined);
    }
  }

  return (
    <div className={styles.root}>
      <Card>
        {files.map(({ name, config }, i) => (
          <button key={i} onClick={() => onClick(name, config)}>
            {i}
          </button>
        ))}

        <div style={{ width: 500 }}>
          <ToingDisplay
            src={src}
            config={config}
            campaign={campaign}
            execution={executions}
          />
        </div>
      </Card>
    </div>
  );
}
