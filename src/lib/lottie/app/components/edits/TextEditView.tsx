import { useId, useState } from "react";
import { textJustifications } from "../../../core/enums/textJustifications";
import { Config, Execution } from "../../../edits/editTypes/editText";
import { combineClasses } from "../../../utils/css";
import { useEffectOnChanged } from "../../../utils/useEffectOnUpdate";
import { EditProps } from "../../uiModule";
import styles from "./TextEditView.module.css";
export default function TextEditView({
  edit,
  onEditChanged,
}: EditProps<Config, Execution>) {
  const id_labelText = useId();
  const id_labelAlign = useId();

  const [currentExecution, setCurrentExecution] = useState<Execution>(
    edit.execution || edit.defaults
  );

  useEffectOnChanged(() => {
    // console.log("execute!!!", currentExecution);
    const newEdit = structuredClone(edit);
    newEdit.execution = newEdit.execution ?? { ...newEdit.defaults };
    newEdit.execution = currentExecution;
    onEditChanged && onEditChanged(newEdit);
  }, [currentExecution]);

  //-------------------------------------------------------

  const handleText = (value: string) => {
    setCurrentExecution((edit) => ({ ...edit, text: value }));
  };

  const handleAlign = (value: textJustifications) => {
    setCurrentExecution((edit) => ({ ...edit, align: value }));
  };

  //-------------------------------------------------------

  return (
    <div className={styles.root}>
      <div className={styles.edits}>
        <div>[{edit.id}]</div>
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
            <div className={styles.buttons} id={id_labelAlign}>
              {[
                ["<", textJustifications.LEFT_JUSTIFY],
                ["-", textJustifications.CENTER_JUSTIFY],
                [">", textJustifications.RIGHT_JUSTIFY],
                // ["<<", textJustifications.FULL_JUSTIFY_LASTLINE_LEFT],
                // ["--", textJustifications.FULL_JUSTIFY_LASTLINE_CENTER],
                // [">>", textJustifications.FULL_JUSTIFY_LASTLINE_RIGHT],
                // ["||", textJustifications.FULL_JUSTIFY_LASTLINE_FULL],
              ].map(([title, val]) => (
                <button
                  className={combineClasses(styles.btn, {
                    [styles.selected]: val === currentExecution.align,
                  })}
                  key={val}
                  onClick={(e) => {
                    e.preventDefault();
                    handleAlign(val as textJustifications);
                  }}
                >
                  {title}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* ------------------------------------------------- */}
        {/* COLOR */}
        {/* ------------------------------------------------- */}
      </div>
    </div>
  );
}
