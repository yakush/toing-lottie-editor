import { Layer } from "../../core";
import List from "./List";
import ListHeader from "./ListHeader";
import styles from "./LottieLayersTree.module.css";
import LottieLayer from "./lottieLayer";

type Props = {
  layers?: Layer[];
  children?: React.ReactNode;
};

export default function LottieLayersTree({ layers, children }: Props) {
  return (
    <div className={styles.root}>
      <List>
        {children && <ListHeader>{children}</ListHeader>}
        {layers?.map((layer) => (
          <LottieLayer layer={layer} key={layer.ind} />
        ))}
      </List>
    </div>
  );
}
