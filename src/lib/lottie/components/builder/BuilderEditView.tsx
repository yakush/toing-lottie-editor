import { useId, useState } from "react";
import builderUiModule from "../../modules/builderUiModule";
import { ToingEditEndpoint } from "../../types";
import BuilderCard from "./BuilderCard";
import BuilderCardHeader from "./BuilderCardHeader";
import styles from "./BuilderEditView.module.css";
import useToingStore from "../../stores/ToingStore";
import Button from "../ui/Button";

type Props = {
  edit: ToingEditEndpoint;
};

export default function BuilderEditView({ edit }: Props) {
  const setConfig = useToingStore((state) => state.setConfig);
  const [open, setOpen] = useState(true);

  const id_name = useId();
  const id_description = useId();

  const onEditChanged = (newEdit: ToingEditEndpoint) => {
    setConfig((old) => {
      const newEditsList = old?.editEndpoints?.map((edit) =>
        edit.id === newEdit.id ? newEdit : edit
      );

      return { ...old, editEndpoints: newEditsList };
    });
  };

  const deleteEdit = () => {
    setConfig((old) => {
      const newEditsList = old?.editEndpoints?.filter(
        (item) => item.id !== edit.id
      );
      return { ...old, editEndpoints: newEditsList };
    });
  };

  const move = (dx: number) => {
    setConfig((old) => {
      const newEditsList = old.editEndpoints ? old.editEndpoints : [];
      const currentIdx = newEditsList.findIndex((item) => item.id === edit.id);
      if (currentIdx === -1) {
        return old;
      }
      if (currentIdx + dx < 0) {
        return old;
      }
      if (currentIdx + dx >= newEditsList.length) {
        return old;
      }
      //remove then insert
      const item = newEditsList.splice(currentIdx, 1)[0];
      newEditsList.splice(currentIdx + dx, 0, item);
      return { ...old, editEndpoints: newEditsList };
    });
  };

  const updateEdit = (changes: Partial<ToingEditEndpoint>) => {
    const newEdit = { ...edit, ...changes };
    onEditChanged(newEdit);
  };

  return (
    <BuilderCard>
      <BuilderCardHeader>
        <div className={styles.header}>
          {/* <div className={styles.id}>[{edit.id}]</div> */}
          <div className={styles.title} onClick={() => setOpen((x) => !x)}>
            <div className={styles.opener}>{open ? "-" : "+"}</div>
            <div className={styles.type}>{edit.type}</div>
          </div>
          <div className={styles.ui}>
            <Button onClick={(e) => move(-1)}>UP</Button>
            <Button onClick={(e) => move(+1)}>DOWN</Button>
            <Button onClick={deleteEdit}>delete</Button>
          </div>
        </div>
      </BuilderCardHeader>

      {open && (
        <div>
          {/* //------------------------------------------------------- */}
          {/* general fields */}
          <div className={styles.generalFields}>
            <label htmlFor={id_name}>name</label>
            <input
              type="text"
              name="name"
              id={id_name}
              value={edit.name}
              autoComplete="off"
              onChange={(e) => updateEdit({ name: e.target.value })}
            />

            <label htmlFor={id_description}>description</label>
            <input
              type="text"
              name="description"
              id={id_description}
              value={edit.description}
              autoComplete="off"
              onChange={(e) => updateEdit({ description: e.target.value })}
            />
          </div>

          <hr />
          {/* //------------------------------------------------------- */}
          {/* specific editor */}
          {builderUiModule.editBuilders.getComponent(edit.type, {
            edit,
            onEditChanged,
          })}
        </div>
      )}
    </BuilderCard>
  );
}
