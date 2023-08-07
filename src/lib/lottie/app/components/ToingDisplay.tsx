import {
  Lottie,
  ToingCampaign,
  ToingConfig,
  ToingUserExecutions,
} from "../../core";
import useLottieStore, { LottieStoreProvider } from "../LottieStore";
import styles from "./ToingDisplay.module.css";

type Props = {
  src: string | Lottie;
  config?: ToingConfig;
  execution?: ToingUserExecutions;
  campaign?: ToingCampaign;
};

function ToingDisplay(props: Props) {
  return (
    <LottieStoreProvider>
      <Inner {...props}></Inner>
    </LottieStoreProvider>
  );
}

function Inner({}: Props) {
  // const a = useLottieStore(store=>store.loadFile)
  return <div className={styles.root}>ToingDisplay</div>;
}



export { ToingDisplay };
export default ToingDisplay;
