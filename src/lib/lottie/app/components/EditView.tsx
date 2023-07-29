import { EditData } from "../../core";
import useLottieStore from "../LottieStore";
import uiModule from "../uiModule";
import EditCard from "./EditCard";
import EditCardHeader from "./EditCardHeader";
import styles from "./EditView.module.css";

type Props = {
  edit: EditData;
};

export default function EditView({ edit }: Props) {
  const setEdits = useLottieStore((state) => state.setEdits);

  const onEditChanged = (newEdit: EditData) => {
    setEdits((old) => {
      const newEditsList = old?.edits?.map((edit) => {
        if (edit.id === newEdit.id) {
          return newEdit;
        }
        return edit;
      });
      return { ...old, edits: newEditsList };
    });
  };

  const onReset = () => {
    const newEdit = structuredClone(edit);
    newEdit.execution = structuredClone(edit.defaults);
    onEditChanged(newEdit);
  };

  return (
    <EditCard onReset={onReset}>
      <EditCardHeader>
        <div className={styles.title}>
          <div className={styles.name}>{edit.name}</div>
          <div>[text edit]</div>
        </div>
        <div>{edit.description}</div>
      </EditCardHeader>

      {uiModule.edits.getComponent(edit.type, {
        edit,
        onEditChanged,
      })}
    </EditCard>
  );
}
