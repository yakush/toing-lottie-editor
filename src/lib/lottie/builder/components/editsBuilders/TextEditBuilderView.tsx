import { useId } from "react";
import { useLottieStore } from "../../../app";
import {
  ToingEditEndpoint,
  LayerRef,
  LottieRef,
  editTypes,
  layerTypes,
} from "../../../core";
import { Config, Execution } from "../../../edits/editTypes/editText";
import editsModule from "../../../edits/editsModule";
import { findLayerRef } from "../../../utils/lottieUtils";
import { EditBuilderProps } from "../../builderUiModule";
import RefSelector from "../RefSelector";
import styles from "./TextEditBuilderView.module.css";
import { textJustifications } from "../../../core/enums/textJustifications";
import TextAlignSelector from "../../../app/components/TextAlignSelector";

type ChangeFunc<T> = <K extends keyof T, V extends T[K]>(
  key: K,
  value: V
) => void;

type Props = EditBuilderProps<Config, Execution>;

export default function TextEditBuilderView({ edit, onEditChanged }: Props) {
  const { config } = edit;
  const origLottie = useLottieStore((store) => store.origLottie);

  const id_enableMultiline = useId();
  const id_enableAlign = useId();

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

  const onChangeRef = (ref?: LottieRef) => {
    const targetLayerRef = ref as LayerRef | undefined;
    let newEdit = structuredClone(edit);

    newEdit.config = { ...newEdit.config, targetLayer: targetLayerRef };
    newEdit.defaults = {};    

    //TODO: get defaults from target layer should NOT BE in the view logic!
    //get defaults from target layer:
    const origLayer = findLayerRef(origLottie, targetLayerRef);
    if (origLayer && origLayer.ty === layerTypes.text) {
      const editExecuter = editsModule.getExecuter(editTypes.text);
      if (editExecuter && origLottie) {
        newEdit.defaults = editExecuter.createNewDefaults(origLottie, newEdit);
      }
    }
    update(newEdit);
  };

  return (
    <div className={styles.root}>
      {/* <pre>{JSON.stringify(edit, null, 2)}</pre> */}

      <div className={styles.fields}>
        <label>target layer</label>
        <RefSelector
          value={edit.config.targetLayer}
          onChange={onChangeRef}
          disableShape
          allowLayerTypes={[layerTypes.text]}
        />

        <label htmlFor={id_enableMultiline}>enable Multiline</label>
        <input
          className={styles.left}
          type="checkbox"
          id={id_enableMultiline}
          checked={config.enableMultiline}
          onChange={(e) => onChangedConfig("enableMultiline", e.target.checked)}
        />

        <label htmlFor={id_enableAlign}>enable Align</label>
        <input
          type="checkbox"
          id={id_enableAlign}
          checked={config.enableAlign}
          onChange={(e) => onChangedConfig("enableAlign", e.target.checked)}
        />

        <hr className={styles.full} />
        <div className={styles.full}> DEFAULTS</div>

        <label>default text</label>
        <input
          type="text"
          value={edit.defaults.text || ""}
          onChange={(e) => onChangedDefaults("text", e.target.value)}
        />

        {edit.config.enableAlign && (
          <>
            <label>default align</label>
            {/* <select name="" id="" onChange={e=>onChangedDefaults("align",e.target.value)}> */}
            <TextAlignSelector
              value={edit.defaults.align}
              onChange={(val) => onChangedDefaults("align", val)}
            />
          </>
        )}
      </div>
    </div>
  );
}
