import {
  Lottie,
  ToingCampaign,
  ToingConfig,
  ToingUserExecutions,
} from "../../core";
import styles from "./ToingDisplay.module.css";

type Props = {
  src: string | Lottie;
  config?: ToingConfig;
  execution?: ToingUserExecutions;
  campaign?: ToingCampaign;
};

function ToingDisplay({}: Props) {
  return <div className={styles.root}>ToingDisplay</div>;
}

export { ToingDisplay };
export default ToingDisplay;
