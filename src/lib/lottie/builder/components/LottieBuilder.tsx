import { useLottieStore } from "../../app";
import Card from "../../app/components/Card";
import CardFooter from "../../app/components/CardFooter";
import CardHeader from "../../app/components/CardHeader";
import { EditData, editTypes } from "../../core";
import editsModule from "../../edits/editsModule";
import { EditsRegistry } from "../../utils/editsRegistryClass";
import builderUiModule from "../builderUiModule";
import BuilderCard from "./BuilderCard";
import BuilderEditView from "./BuilderEditView";
import styles from "./LottieBuilder.module.css";
import { v4 as uuid } from "uuid";

type Props = {};

export default function LottieBuilder({}: Props) {
  const edits = useLottieStore((state) => state.edits);
  const setEdits = useLottieStore((state) => state.setEdits);

  const onEditChanged = (newEdit: EditData) => {
    setEdits((old) => {
      const newEditsList = old?.edits?.map((edit) => {
        if (edit.id === newEdit.id) {
          return newEdit;
        }
        return edit;
      });
      return { ...old, edits: newEditsList };
    });
  };

  //-------------------------------------------------------
  const addTextEdit = () => {
    const executer = editsModule.getExecuter(editTypes.text);
    if (!executer) {
      return;
    }
    const newEdit: EditData = {
      type: editTypes.text,
      id: uuid(),
      name: "",
      description: "",
      config: executer.createNewConfig(),
      defaults: {},
    };

    setEdits((old) => {
      const oldList = old.edits || [];
      return { ...old, edits: [newEdit, ...oldList] };
    });
  };

  return (
    <div className={styles.root}>
      <div className={styles.buttons}>
        <button onClick={addTextEdit}>add text</button>
        <button>add LayerSelect</button>
        <button>add Color</button>
      </div>
      <div className={styles.listWrapper}>
        <div className={styles.list}>
          {edits?.edits?.map((edit) => (
            <div key={edit.id} className={styles.item}>
              <BuilderEditView edit={edit} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
