import { useId } from "react";
import TextAlignSelector from "../../components/TextAlignSelector";
import { textJustifications } from "../../enums/textJustifications";
import { EditProps } from "../../modules/editorUiModule";
import { combineClasses } from "../../utils/css";
import styles from "./TextEditView.module.css";
import { Config, Execution } from "./TextExecuter";

export default function TextEditView({
  editEndpoint,
  execution,
  onChange,
}: EditProps<Config, Execution>) {
  const id_labelText = useId();
  const id_labelAlign = useId();

  //-------------------------------------------------------
  const handleText = (value: string) => {
    onChange && onChange({ ...execution, text: value });
  };

  const handleAlign = (value: textJustifications) => {
    onChange && onChange({ ...execution, align: value });
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
          {editEndpoint.config.enableMultiline ? (
            <textarea
              className={combineClasses(styles.input, styles.multiLine)}
              id={id_labelText}
              onChange={(e) => handleText(e.target.value)}
              value={execution?.text || ""}
            />
          ) : (
            <input
              className={combineClasses(styles.input, styles.singleLine)}
              id={id_labelText}
              type="text"
              autoComplete="off"
              value={execution?.text || ""}
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
        {editEndpoint.config.enableAlign && (
          <div className={styles.align}>
            <label htmlFor={id_labelAlign}>align</label>

            <TextAlignSelector
              value={execution?.align}
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
