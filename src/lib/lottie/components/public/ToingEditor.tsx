import useToingStore from "../../stores/ToingStore";
import { ToingUserExecutions } from "../../types";
import LottiePlayer from "../LottiePlayer";
import { withToingStore } from "../ToingStoreWrapper";
import LottieEditor from "../editor/LottieEditor";
import { ToingPublicProps } from "../toing-public-props";
import Button from "../ui/Button";
import Card from "../ui/Card";
import styles from "./ToingEditor.module.css";

type Props = ToingPublicProps & {
  onExportExecution?: (execution: ToingUserExecutions) => void;
};

const ToingEditor = withToingStore(({ onExportExecution }: Props) => {
  const userExecutions = useToingStore((store) => store.userExecutions);

  const onClickExport = () => {
    onExportExecution && userExecutions && onExportExecution(userExecutions);
  };

  return (
    <div className={styles.root}>
      <div className={styles.export}>
        <Button onClick={onClickExport}>export</Button>
      </div>
      <div className={styles.edits}>
        <Card>
          <LottieEditor />
        </Card>
      </div>

      <div className={styles.player}>
        <Card>
          <LottiePlayer controls buttons={["play"]} />
          {/* <pre>{JSON.stringify(userExecutions, null, 2)}</pre> */}
        </Card>
      </div>
    </div>
  );
});

export { ToingEditor };
export default ToingEditor;
