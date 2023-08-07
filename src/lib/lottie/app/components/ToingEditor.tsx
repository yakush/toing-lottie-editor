import { Lottie, ToingCampaign, ToingConfig, ToingUserExecutions } from "../../core";
import styles from "./ToingEditor.module.css";

type Props = {
  src: string | Lottie;
  config?: ToingConfig;
  execution?: ToingUserExecutions;
  campaign?: ToingCampaign;
};

function ToingEditor({}: Props) {
  return <div className={styles.root}>ToingEditor</div>;
}

export { ToingEditor };
export default ToingEditor;
