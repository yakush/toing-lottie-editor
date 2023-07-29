import { ChangeEvent, useId } from "react";
import { useLottieStore } from "../../app";
import { EditData } from "../../core";
import builderUiModule from "../builderUiModule";
import BuilderCard from "./BuilderCard";
import BuilderCardHeader from "./BuilderCardHeader";
import styles from "./BuilderEditView.module.css";

type Props = {
  edit: EditData;
};

export default function BuilderEditView({ edit }: Props) {
  const setEdits = useLottieStore((state) => state.setEdits);

  const id_name = useId();
  const id_description = useId();

  const onEditChanged = (newEdit: EditData) => {
    setEdits((old) => {
      const newEditsList = old?.edits?.map((edit) =>
        edit.id === newEdit.id ? newEdit : edit
      );

      return { ...old, edits: newEditsList };
    });
  };

  const deleteEdit = () => {
    setEdits((old) => {
      const newEditsList = old?.edits?.filter((item) => item.id !== edit.id);
      return { ...old, edits: newEditsList };
    });
  };

  const move = (dx: number) => {
    setEdits((old) => {
      const newEditsList = old.edits ? old.edits : [];
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
      return { ...old, edits: newEditsList };
    });
  };

  const updateEdit = (changes: Partial<EditData>) => {
    const newEdit = { ...edit, ...changes };
    onEditChanged(newEdit);
  };

  return (
    <BuilderCard>
      <BuilderCardHeader>
        <div className={styles.header}>
          <div className={styles.type}>[{edit.type}]</div>
          <div className={styles.ui}>
            <button onClick={(e) => move(-1)}>UP</button>
            <button onClick={(e) => move(+1)}>DOWN</button>
            <button onClick={deleteEdit}>delete</button>
          </div>
        </div>
      </BuilderCardHeader>

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
    </BuilderCard>
  );
}
