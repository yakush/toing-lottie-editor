import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useId,
  useState,
} from "react";
import { EditProps } from "../../uiModule";
import { Config, Execution } from "../../../edits/editTypes/editText";
import styles from "./TextEditView.module.css";
import { textJustifications } from "../../../core/enums/textJustifications";
import { useEffectOnChanged } from "../../../utils/useEffectOnUpdate";
import { combineClasses } from "../../../utils/css";
import EditCard from "../../../../../components/EditCard";
import EditCardHeader from "../../../../../components/EditCardHeader";
export default function TextEditView({
  edit,
  onEditChanged,
}: EditProps<Config, Execution>) {
  const labelIdText = useId();
  const labelIdAlign = useId();

  const [currentText, setCurrentText] = useState(
    edit.execution?.text || edit.defaults.text || ""
  );
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
    setCurrentText(value);
    setCurrentExecution((edit) => ({ ...edit, text: value }));
  };

  const handleAlign = (value: textJustifications) => {
    setCurrentExecution((edit) => ({ ...edit, align: value }));
  };

  const handleReset = () => {
    setCurrentExecution(edit.defaults);
    setCurrentText(edit.defaults.text ?? "");
  };

  //-------------------------------------------------------

  return (
    <div className={styles.root}>
      <EditCard onReset={handleReset}>
        <EditCardHeader>
          <div className={styles.title}>
            <div className={styles.name}>{edit.name}</div>
            <div>[text edit]</div>
          </div>
        </EditCardHeader>

        <div className={styles.edits}>
          <div>[{edit.id}]</div>
          {/* ------------------------------------------------- */}
          {/* TEXT */}
          {/* ------------------------------------------------- */}
          <div className={styles.text}>
            <label htmlFor={labelIdText}>text</label>
            {edit.config.enableMultiline ? (
              <textarea
                className={combineClasses(styles.input, styles.multiLine)}
                id={labelIdText}
                onChange={(e) => handleText(e.target.value)}
                value={currentText}
              />
            ) : (
              <input
                className={combineClasses(styles.input, styles.singleLine)}
                id={labelIdText}
                type="text"
                autoComplete="off"
                value={currentText}
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
              <label htmlFor={labelIdAlign}>align</label>
              <div className={styles.buttons} id={labelIdAlign}>
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
      </EditCard>
    </div>
  );
}
