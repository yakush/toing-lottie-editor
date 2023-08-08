import {
  Lottie,
  ToingCampaign,
  ToingConfig,
  ToingUserExecutions,
} from "../types";
import styles from "./ToingEditor.module.css";
import { withToingStore } from "./ToingStoreWrapper";

type Props = {
  src: string | Lottie;
  config?: ToingConfig;
  execution?: ToingUserExecutions;
  campaign?: ToingCampaign;
};

const ToingEditor = withToingStore(({}: Props) => {
  return <div className={styles.root}>ToingEditor</div>;
});

export { ToingEditor };
export default ToingEditor;
