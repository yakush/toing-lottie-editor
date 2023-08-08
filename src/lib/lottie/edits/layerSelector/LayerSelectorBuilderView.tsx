import { useId } from "react";
import { v4 as uuid } from "uuid";
import RefListSelector from "../../builder/components/RefListSelector";
import { EditBuilderProps } from "../../modules/builderUiModule";
import { ToingEditEndpoint } from "../../types";
import styles from "./LayerSelectorBuilderView.module.css";
import {
  Config,
  Execution,
  LayerSelectorOption,
} from "./LayerSelectorExecuter";

type ChangeFunc<T> = <K extends keyof T, V extends T[K]>(
  key: K,
  value: V
) => void;

type Props = EditBuilderProps<Config, Execution>;

export default function LayerSelectorBuilderView({
  edit,
  onEditChanged,
}: Props) {
  const { config } = edit;

  const id = useId();

  const update = (newData: ToingEditEndpoint<Config, Execution>) => {
    if (!onEditChanged) {
      return;
    }
    onEditChanged(newData);
  };

  const onChangedConfig: ChangeFunc<Config> = (key, val) => {
    const newEdit = structuredClone(edit);
    newEdit.config = { ...newEdit.config, ...{ [key]: val } };
    update(newEdit);
  };

  const onChangedDefaults: ChangeFunc<Execution> = (key, val) => {
    const newEdit = structuredClone(edit);
    newEdit.defaults = { ...newEdit.defaults, ...{ [key]: val } };
    update(newEdit);
  };

  return (
    <div className={styles.root}>
      <div className={styles.fields}>
        {/* HIDE */}
        <label htmlFor={`${id}-enableHide`}>allow hide all</label>
        <input
          id={`${id}-enableHide`}
          type="checkbox"
          name="enableHide"
          checked={config.enableHide}
          onChange={(e) => onChangedConfig("enableHide", e.target.checked)}
        />

        {/* OPTIONS */}
        <label className={styles.full}>options list:</label>
        <div className={styles.full}>
          <List
            options={config.options}
            onChange={(newOptions) =>
              onChangedConfig("options", newOptions ?? [])
            }
          />
        </div>

        {/* DEFAULTS */}
        <hr className={styles.full} />
        <div className={styles.full}> DEFAULTS</div>

        {!!edit.config.enableHide && (
          <>
            <label>hide</label>
            <input
              id={`${id}-default-hide`}
              type="checkbox"
              name="enableHide"
              checked={!!edit.defaults.hide}
              onChange={(e) => onChangedDefaults("hide", e.target.checked)}
            />
          </>
        )}

        <label>default group</label>
        <select
          value={
            edit.defaults.selectedIdx != null ? edit.defaults.selectedIdx : 0
          }
          onChange={(e) => {
            onChangedDefaults("selectedIdx", +e.target.value);
          }}
        >
          {config?.options?.map((option, i) => (
            <option key={option.id} value={i}>
              {i} : {option.name}
            </option>
          ))}
        </select>
      </div>

      {/* <pre>{JSON.stringify(edit, null, 2)}</pre> */}
    </div>
  );
}

//-------------------------------------------------------
//-------------------------------------------------------
//-------------------------------------------------------
//-------------------------------------------------------

type ListProps = {
  options?: LayerSelectorOption[];
  onChange?: (options?: LayerSelectorOption[]) => void;
};

const List = ({ options, onChange }: ListProps) => {
  const onChangeListItem = (index: number, newItem: LayerSelectorOption) => {
    const newOptions = options?.map((item, i) =>
      i === index ? newItem : item
    );
    onChange && onChange(newOptions);
  };

  const onDeleteListItem = (index: number) => {
    const newOptions = options?.filter((item, i) => i !== index);
    onChange && onChange(newOptions);
  };

  const createOption = () => {
    const option: LayerSelectorOption = {
      id: uuid(),
      description: "",
      name: "",
      targets: [],
    };
    const newOptions = [...(options ?? []), option];
    onChange && onChange(newOptions);
  };

  const moveListItem = (idx: number, distance: number) => {
    if (!options) {
      return options;
    }

    const newIdx = idx + distance;

    if (newIdx < 0) {
      return options;
    }
    if (newIdx >= options.length) {
      return options;
    }

    const newOptions = [...options];

    //remove then insert
    const temp = newOptions.splice(idx, 1)[0];
    newOptions.splice(newIdx, 0, temp);
    onChange && onChange(newOptions);
  };

  return (
    <div className={styles.optionsList}>
      {options?.map((option, i) => (
        <div className={styles.listItemWrapper} key={option.id}>
          <ListItem
            onChange={(newOption) => onChangeListItem(i, newOption)}
            option={option}
          />
          <div className={styles.ui}>
            <button onClick={() => onDeleteListItem(i)}>x</button>
            <div className={styles.gap}></div>
            <button onClick={() => moveListItem(i, -1)}>up</button>
            <button onClick={() => moveListItem(i, +1)}>down</button>
          </div>
        </div>
      ))}
      <button onClick={createOption}>add option</button>
    </div>
  );
};

//-------------------------------------------------------
//-------------------------------------------------------

type ListItemProps = {
  option: LayerSelectorOption;
  onChange?: (option: LayerSelectorOption) => void;
};

const ListItem = ({ option, onChange }: ListItemProps) => {
  const id = useId();

  const onChangeHandler: ChangeFunc<LayerSelectorOption> = (key, val) => {
    const newOption = { ...option, [key]: val };
    onChange && onChange(newOption);
  };

  return (
    <div className={styles.item}>
      <div className={styles.fields}>
        <label htmlFor={`${id}-name`}>name</label>
        <input
          autoComplete="off"
          id={`${id}-name`}
          type="text"
          name="name"
          value={option.name}
          onChange={(e) => onChangeHandler("name", e.target.value)}
        />

        <label htmlFor={`${id}-description`}>description</label>
        <input
          autoComplete="off"
          id={`${id}-name`}
          type="text"
          name="description"
          value={option.description}
          onChange={(e) => onChangeHandler("description", e.target.value)}
        />

        <label htmlFor={`${id}-targets`}>targets</label>
        <RefListSelector
          values={option.targets}
          onChange={(refs) => onChangeHandler("targets", refs)}
        />
      </div>
      {/* <div> {JSON.stringify(option)}</div> */}
    </div>
  );
};
