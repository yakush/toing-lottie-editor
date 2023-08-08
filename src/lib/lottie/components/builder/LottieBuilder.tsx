import { v4 as uuid } from "uuid";
import { editTypes } from "../../enums";
import editsModule from "../../modules/editorModule";
import useToingStore from "../../stores/ToingStore";
import { ToingEditEndpoint } from "../../types";
import BuilderEditView from "./BuilderEditView";
import styles from "./LottieBuilder.module.css";
import Button from "../ui/Button";

type Props = {};

export default function LottieBuilder({}: Props) {
  const edits = useToingStore((state) => state.config);
  const setConfig = useToingStore((state) => state.setConfig);
  const lottie = useToingStore((store) => store.lottie);

  //-------------------------------------------------------
  const createEdit = (type: editTypes) => {
    const executer = editsModule.edits.get(type);
    if (!executer) {
      return;
    }

    const newEdit: ToingEditEndpoint = {
      type: type,
      id: uuid(),
      name: "",
      description: "",
      config: executer.createNewConfig(),
      defaults: {},
    };
    newEdit.defaults = executer.createNewDefaults(lottie, newEdit);

    setConfig((old) => {
      const oldList = old.editEndpoints || [];
      return { ...old, editEndpoints: [newEdit, ...oldList] };
    });
  };

  return (
    <div className={styles.root}>
      <div className={styles.buttons}>
        <Button onClick={() => createEdit(editTypes.text)}>add text</Button>
        <Button onClick={() => createEdit(editTypes.layerSelector)}>
          add LayerSelect
        </Button>
        <Button onClick={() => createEdit(editTypes.colors)}>add Color</Button>
      </div>
      <div className={styles.listWrapper}>
        <div className={styles.list}>
          {edits?.editEndpoints?.map((edit) => (
            <div key={edit.id} className={styles.item}>
              <BuilderEditView edit={edit} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
