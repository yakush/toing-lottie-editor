import {
  Lottie,
  ToingCampaign,
  ToingConfig,
  ToingUserExecutions,
} from "../../core";
import styles from "./ToingBuilder.module.css";

type Props = {
  src: string | Lottie;
  config?: ToingConfig;
  execution?: ToingUserExecutions;
  campaign?: ToingCampaign;
};

function ToingBuilder({}: Props) {
  return <div className={styles.root}>ToingBuilder</div>;
}

export { ToingBuilder };
export default ToingBuilder;
