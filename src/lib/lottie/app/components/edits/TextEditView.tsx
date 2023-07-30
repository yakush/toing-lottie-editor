import { useId } from "react";
import { textJustifications } from "../../../core/enums/textJustifications";
import { Config, Execution } from "../../../edits/editTypes/editText";
import { combineClasses } from "../../../utils/css";
import { EditProps } from "../../uiModule";
import styles from "./TextEditView.module.css";
import TextAlignSelector from "../TextAlignSelector";
export default function TextEditView({
  edit,
  onEditChanged,
}: EditProps<Config, Execution>) {
  const id_labelText = useId();
  const id_labelAlign = useId();

  //-------------------------------------------------------
  const updateExecution = (exe: Execution) => {
    const newEdit = structuredClone(edit);
    newEdit.execution = newEdit.execution ?? { ...newEdit.defaults };
    newEdit.execution = exe;
    onEditChanged && onEditChanged(newEdit);
  };

  const handleText = (value: string) => {
    updateExecution({ ...edit.execution, text: value });
  };

  const handleAlign = (value: textJustifications) => {
    updateExecution({ ...edit.execution, align: value });
  };

  //-------------------------------------------------------

  return (
    <div className={styles.root}>
      <div className={styles.edits}>
        {/* <div>[{edit.id}]</div> */}
        {/* ------------------------------------------------- */}
        {/* TEXT */}
        {/* ------------------------------------------------- */}
        <div className={styles.text}>
          <label htmlFor={id_labelText}>text</label>
          {edit.config.enableMultiline ? (
            <textarea
              className={combineClasses(styles.input, styles.multiLine)}
              id={id_labelText}
              onChange={(e) => handleText(e.target.value)}
              value={edit.execution?.text || ""}
            />
          ) : (
            <input
              className={combineClasses(styles.input, styles.singleLine)}
              id={id_labelText}
              type="text"
              autoComplete="off"
              value={edit.execution?.text || ""}
              onChange={(e) => handleText(e.target.value)}
            />
          )}
          <div className={styles.buttons}>
            {/* <input type="submit" value="update" /> */}
          </div>
        </div>

        {/* ------------------------------------------------- */}
        {/* ALIGN */}
        {/* ------------------------------------------------- */}
        {edit.config.enableAlign && (
          <div className={styles.align}>
            <label htmlFor={id_labelAlign}>align</label>

            <TextAlignSelector
              value={edit.execution?.align}
              onChange={(val) => handleAlign(val)}
            />
          </div>
        )}
        {/* ------------------------------------------------- */}
        {/* COLOR */}
        {/* ------------------------------------------------- */}
      </div>
    </div>
  );
}
