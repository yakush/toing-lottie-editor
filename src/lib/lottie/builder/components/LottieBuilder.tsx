import { v4 as uuid } from "uuid";
import { useLottieStore } from "../../app";
import { EditData, editTypes } from "../../core";
import editsModule from "../../edits/editsModule";
import BuilderEditView from "./BuilderEditView";
import styles from "./LottieBuilder.module.css";

type Props = {};

export default function LottieBuilder({}: Props) {
  const edits = useLottieStore((state) => state.edits);
  const setEdits = useLottieStore((state) => state.setEdits);
  const lottie = useLottieStore(store=>store.lottie);

  //-------------------------------------------------------
  const createEdit = (type:editTypes) => {
    const executer = editsModule.getExecuter(type);
    if (!executer) {
      return;
    }
    
    const newEdit: EditData = {
      type: type,
      id: uuid(),
      name: "",
      description: "",
      config: executer.createNewConfig(),
      defaults:{}
    };
    newEdit.defaults = executer.createNewDefaults(lottie, newEdit);
    
    setEdits((old) => {
      const oldList = old.edits || [];
      return { ...old, edits: [newEdit, ...oldList] };
    });
  };

  return (
    <div className={styles.root}>
      <div className={styles.buttons}>
        <button onClick={()=>createEdit(editTypes.text)}>add text</button>
        <button onClick={()=>createEdit(editTypes.layerSelect)}>add LayerSelect</button>
        <button onClick={()=>createEdit(editTypes.colors)}>add Color</button>
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
