import { EditData } from "../../core";
import useLottieStore from "../LottieStore";
import uiModule from "../uiModule";
import styles from "./LottieEditor.module.css";

type Props = {};

export default function LottieEditor({}: Props) {
  const edits = useLottieStore((state) => state.edits);
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

  return (
    <div className={styles.root}>
      <div className={styles.list}>
        {edits?.edits?.map((edit) => (
          <div key={edit.id} className={styles.item}>
            {uiModule.edits.getComponent(edit.type, {
              edit,
              onEditChanged,
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
