import { EditData } from "../../core";
import useLottieStore from "../LottieStore";
import uiModule from "../uiModule";
import EditView from "./EditView";
import styles from "./LottieEditor.module.css";

type Props = {};

export default function LottieEditor({}: Props) {
  const edits = useLottieStore((state) => state.edits);

  return (
    <div className={styles.root}>
      <div className={styles.list}>
        {edits?.edits?.map((edit) => (
          <div key={edit.id} className={styles.item}>
            <EditView edit={edit} />
          </div>
        ))}
      </div>
    </div>
  );
}
