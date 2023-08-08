import useToingStore from "../../stores/ToingStore";
import Button from "../ui/Button";
import { useListStore, withListStore } from "./List";
import styles from "./LottieJson.module.css";
import LottieTree from "./LottieLayersTree";

type Props = {};

const LottieJson = withListStore(({}: Props) => {
  const lottie = useToingStore((state) => state.lottie);
  const listStore = useListStore();

  if (!lottie) {
    return <>no lottie json</>;
  }

  return (
    <div className={styles.root}>
      <div className={styles.listHeader}>
        <div style={{ flex: 1 }}></div>
        <Button onClick={listStore?.actions.closeAll}>-</Button>
        <Button onClick={listStore?.actions.openAll}>+</Button>
      </div>
      <LottieTree layers={lottie.layers}>
        <div>Lottie File</div>
      </LottieTree>
    </div>
  );
});

export default LottieJson;
