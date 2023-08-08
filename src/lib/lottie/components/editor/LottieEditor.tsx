import useToingStore from "../../stores/ToingStore";
import EditView from "./EditView";
import styles from "./LottieEditor.module.css";

type Props = {};

export default function LottieEditor({}: Props) {
  const config = useToingStore((state) => state.config);
  const userExecutions = useToingStore((state) => state.userExecutions);

  return (
    <div className={styles.root}>
      <div className={styles.list}>
        {config?.editEndpoints?.map((editEndpoint) => {
          const id = editEndpoint.id;
          let execution =
            userExecutions?.executions && userExecutions?.executions[id];
          execution = execution ?? editEndpoint.defaults;

          return (
            <div key={editEndpoint.id} className={styles.item}>
              <EditView editEndpoint={editEndpoint} execution={execution} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
