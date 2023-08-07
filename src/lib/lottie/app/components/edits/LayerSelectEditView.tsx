import { useId } from "react";
import { Config, Execution } from "../../../edits/editTypes/editLayerSelector";
import { EditProps } from "../../uiModule";
import styles from "./TextEditView.module.css";

export default function LayerSelectEditView({
  editEndpoint,
  execution,
  onChange: onEditChanged,
}: EditProps<Config, Execution>) {
  const id = useId();
  //-------------------------------------------------------

  const onSelectHide = () => {
    onEditChanged && onEditChanged({ ...execution, hide: true });
  };

  const onSelectOption = (value: number) => {
    onEditChanged &&
      onEditChanged({ ...execution, selectedIdx: value, hide: false });
  };
  //-------------------------------------------------------

  return (
    <div className={styles.root}>
      <div className={styles.edits}>
        <div className={styles.options}>
          {editEndpoint.config.enableHide && (
            <div>
              <input
                id={`${id}-HIDE`}
                type="radio"
                name={`${id}-options`}
                checked={!!execution?.hide}
                onChange={() => onSelectHide()}
              />
              <label htmlFor={`${id}-HIDE`}>HIDE</label>
            </div>
          )}

          {editEndpoint.config?.options?.map((option, i) => (
            <div key={option.id}>
              <input
                id={`${id}-${i}`}
                type="radio"
                name={`${id}-options`}
                value={i}
                checked={
                  !!execution?.hide ? false : execution?.selectedIdx === i
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
