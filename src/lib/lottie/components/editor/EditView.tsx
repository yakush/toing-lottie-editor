import uiModule from "../../modules/editorUiModule";
import useToingStore from "../../stores/ToingStore";
import { ToingEditEndpoint } from "../../types";
import EditCard from "./EditCard";
import EditCardHeader from "./EditCardHeader";
import styles from "./EditView.module.css";

type Props = {
  editEndpoint: ToingEditEndpoint;
  execution?: object;
};

export default function EditView({ editEndpoint, execution }: Props) {
  const setExecutions = useToingStore((state) => state.setExecutions);

  const onChange = (execution: any) => {
    setExecutions((old) => {
      const newExecutions = { ...old?.executions };
      newExecutions[editEndpoint.id] = execution;
      return { ...old, executions: newExecutions };
    });
  };

  const onReset = () => {
    console.log("reset to default", editEndpoint.id, editEndpoint.name);
    setExecutions((old) => {
      const newExecutions = { ...old?.executions };
      delete newExecutions[editEndpoint.id];
      return { ...old, executions: newExecutions };
    });
  };

  return (
    <EditCard onReset={onReset}>
      <EditCardHeader>
        <div className={styles.title}>
          <div className={styles.name}>{editEndpoint.name}</div>
          <div>[{editEndpoint.type} edit]</div>
        </div>
        <div>{editEndpoint.description}</div>
      </EditCardHeader>
      <div>
        {/* //------------------------------------------------------- */}
        {/* specific editor */}
        {uiModule.edits.getComponent(editEndpoint.type, {
          editEndpoint,
          execution,
          onChange,
        })}
      </div>
    </EditCard>
  );
}
