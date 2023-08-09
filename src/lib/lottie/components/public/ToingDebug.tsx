import useToingStore from "../../stores/ToingStore";
import { withToingStore } from "../ToingStoreWrapper";
import { ToingPublicProps } from "../toing-public-props";
import styles from "./ToingDisplay.module.css";

type Props = ToingPublicProps & {};

const ToingDebug = withToingStore((props: Props) => {
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
    </div>
  );
});

export { ToingDebug };
export default ToingDebug;
