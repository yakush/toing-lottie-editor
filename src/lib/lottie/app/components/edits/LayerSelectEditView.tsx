import { useId, useState } from "react";
import RefListSelector from "../../../builder/components/RefListSelector";
import { Config, Execution } from "../../../edits/editTypes/editLayerSelector";
import { EditProps } from "../../uiModule";
import styles from "./TextEditView.module.css";

export default function LayerSelectEditView({
  edit,
  onEditChanged,
}: EditProps<Config, Execution>) {
  const id = useId();
  //-------------------------------------------------------
  const updateExecution = (exe: Execution) => {
    const newEdit = structuredClone(edit);
    newEdit.execution = newEdit.execution ?? { ...newEdit.defaults };
    newEdit.execution = exe;
    onEditChanged && onEditChanged(newEdit);
  };

  const onSelectHide = () => {
    updateExecution({ ...edit.execution, hide: true });
  };

  const onSelectOption = (value: number) => {
    updateExecution({ ...edit.execution, selectedIdx: value, hide: false });
  };
  //-------------------------------------------------------

  return (
    <div className={styles.root}>
      <div className={styles.edits}>
        <div className={styles.options}>
          {edit.config.enableHide && (
            <div>
              <input
                id={`${id}-HIDE`}
                type="radio"
                name="options"
                checked={!!edit.execution?.hide}
                onChange={() => onSelectHide()}
              />
              <label htmlFor={`${id}-HIDE`}>HIDE</label>
            </div>
          )}

          {edit.config?.options?.map((option, i) => (
            <div key={option.id}>
              <input
                id={`${id}-${i}`}
                type="radio"
                name="options"
                value={i}
                checked={
                  !!edit.execution?.hide
                    ? false
                    : edit.execution?.selectedIdx === i
                }
                onChange={() => onSelectOption(i)}
              />
              <label htmlFor={`${id}-${i}`}>{option.name}</label>
            </div>
          ))}
        </div>

        {/* <select>
          {edit.config?.options?.map((option) => (
            <option key={option.id}>
              <div>{option.name}</div>
              <div>{option.description}</div>
            </option>
          ))}
        </select> */}
      </div>
    </div>
  );
}
