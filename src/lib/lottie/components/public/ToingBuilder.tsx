import { DragAndDropStoreProvider } from "../../stores/DragAndDropStore";
import useToingStore from "../../stores/ToingStore";
import { ToingConfig } from "../../types";
import LottiePlayer from "../LottiePlayer";
import { withToingStore } from "../ToingStoreWrapper";
import LottieBuilder from "../builder/LottieBuilder";
import LottieJson from "../builder/LottieJson";
import LottieEditor from "../editor/LottieEditor";
import { ToingPublicProps } from "../toing-public-props";
import Button from "../ui/Button";
import Card from "../ui/Card";
import CardHeader from "../ui/CardHeader";
import styles from "./ToingBuilder.module.css";

type Props = ToingPublicProps & {
  onExportConfig?: (config: ToingConfig) => void;
};

const ToingBuilder = withToingStore(({ onExportConfig }: Props) => {
  const config = useToingStore((store) => store.config);
  const onClickExport = () => {
    onExportConfig && onExportConfig(config || {});
  };
  return (
    <DragAndDropStoreProvider>
      <div className={styles.root}>
        <div className={styles.container}>
          <div className={styles.export}>
            <Button onClick={onClickExport}>export</Button>
          </div>

          <div className={styles.tree}>
            <Card>
              <CardHeader>tree</CardHeader>
              <LottieJson />
            </Card>
          </div>
          <div className={styles.player}>
            <Card>
              <CardHeader>player</CardHeader>
              <LottiePlayer controls buttons={["play", "frame"]} />
            </Card>
          </div>

          <div className={styles.edits}>
            <div className={styles.builder}>
              <Card>
                <CardHeader>builder</CardHeader>

                <LottieBuilder />
              </Card>
            </div>
            <div className={styles.editor}>
              <Card>
                <CardHeader>editor</CardHeader>
                <LottieEditor />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DragAndDropStoreProvider>
  );
});

export { ToingBuilder };
export default ToingBuilder;
