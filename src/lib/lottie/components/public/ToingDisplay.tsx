import LottiePlayer from "../LottiePlayer";
import { withToingStore } from "../ToingStoreWrapper";
import { ToingPublicProps } from "../toing-public-props";
import styles from "./ToingDisplay.module.css";

type Props = ToingPublicProps & {};

const ToingDisplay = withToingStore(({}: Props) => {
  return (
    <div className={styles.root}>
      <LottiePlayer controls={false} />
    </div>
  );
});

export { ToingDisplay };
export default ToingDisplay;
