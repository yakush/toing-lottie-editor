import {
  Lottie,
  ToingCampaign,
  ToingConfig,
  ToingUserExecutions,
} from "../../core";
import useLottieStore from "../LottieStore";
import LottieEditor from "./LottieEditor";
import LottiePlayer from "./LottiePlayer";
import styles from "./ToingDisplay.module.css";
import { withToingStore } from "./ToingStoreWrapper";

type Props = {
  src: string | Lottie;
  config?: ToingConfig;
  execution?: ToingUserExecutions;
  campaign?: ToingCampaign;
};

const ToingDisplay = withToingStore((props: Props) => {
  const displayName = useLottieStore((store) => store.displayName);
  const lottie = useLottieStore((store) => store.lottie);
  const config = useLottieStore((store) => store.config);
  const userExecutions = useLottieStore((store) => store.userExecutions);
  const campaign = useLottieStore((store) => store.campaign);

  return (
    <div className={styles.root}>
      <div> displayName: {JSON.stringify(displayName)}</div>
      <div> lottie: {JSON.stringify(lottie)?.slice(0, 50)} ...</div>
      <div> config: {JSON.stringify(config)?.slice(0, 50)} ...</div>
      <div>
        userExecutions: {JSON.stringify(userExecutions)?.slice(0, 50)} ...{" "}
      </div>
      <div> campaign: {JSON.stringify(campaign)?.slice(0, 50)} ...</div>
      
      <LottiePlayer/>
      <LottieEditor />
    </div>
  );
});

export { ToingDisplay };
export default ToingDisplay;
