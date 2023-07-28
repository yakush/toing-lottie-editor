import { EditData, editTypes } from "../../core";
import useLottieStore from "../LottieStore";
import uiModule from "../uiModule";
import styles from "./LottieEditor.module.css";

type Props = {};

export default function LottieEditor({}: Props) {
  const edits = useLottieStore((state) => state.edits);
  const blinkLayer = useLottieStore((state) => state.blinkLayer);

  const execute = (edit: EditData) => {};

  return (
    <div>
      <div className={styles.root}>
        <div>EDITOR</div>

        {edits?.edits?.map((edit) => (
          <div
            key={edit.id}
            className={styles.item}
            onClick={() => execute(edit)}
          >
            {uiModule.edits.getComponent(edit.type, {
              edit,
              onEditChanged(edit) {
                console.log("edited");
              },
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
