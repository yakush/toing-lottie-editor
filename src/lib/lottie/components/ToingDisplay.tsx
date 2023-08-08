import useToingStore from "../stores/ToingStore";
import {
  Lottie,
  ToingCampaign,
  ToingConfig,
  ToingUserExecutions,
} from "../types";
import LottieEditor from "./editor/LottieEditor";
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
  const displayName = useToingStore((store) => store.displayName);
  const lottie = useToingStore((store) => store.lottie);
  const config = useToingStore((store) => store.config);
  const userExecutions = useToingStore((store) => store.userExecutions);
  const campaign = useToingStore((store) => store.campaign);

  return (
    <div className={styles.root}>
      <div> displayName: {JSON.stringify(displayName)}</div>
      <div> lottie: {JSON.stringify(lottie)?.slice(0, 50)} ...</div>
      <div> config: {JSON.stringify(config)?.slice(0, 50)} ...</div>
      <div>
        userExecutions: {JSON.stringify(userExecutions)?.slice(0, 50)} ...{" "}
      </div>
      <div> campaign: {JSON.stringify(campaign)?.slice(0, 50)} ...</div>

      <LottiePlayer />
      <LottieEditor />
    </div>
  );
});

export { ToingDisplay };
export default ToingDisplay;
