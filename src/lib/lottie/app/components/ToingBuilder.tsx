import {
  Lottie,
  ToingCampaign,
  ToingConfig,
  ToingUserExecutions,
} from "../../core";
import styles from "./ToingBuilder.module.css";
import { withToingStore } from "./ToingStoreWrapper";

type Props = {
  src: string | Lottie;
  config?: ToingConfig;
  execution?: ToingUserExecutions;
  campaign?: ToingCampaign;
};

const ToingBuilder = withToingStore(({}: Props) => {
  return <div className={styles.root}>ToingBuilder</div>;
});

export { ToingBuilder };
export default ToingBuilder;
