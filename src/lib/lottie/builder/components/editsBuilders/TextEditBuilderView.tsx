import { useId } from "react";
import { useLottieStore } from "../../../app";
import {
  EditData,
  LayerRef,
  LottieRef,
  editTypes,
  layerTypes
} from "../../../core";
import { Config, Execution } from "../../../edits/editTypes/editText";
import editsModule from "../../../edits/editsModule";
import { findLayerRef } from "../../../utils/lottieUtils";
import { EditBuilderProps } from "../../builderUiModule";
import RefSelector from "../RefSelector";
import styles from "./TextEditBuilderView.module.css";

type Props = EditBuilderProps<Config, Execution>;

export default function TextEditBuilderView({ edit, onEditChanged }: Props) {
  const { config } = edit;
  const origLottie = useLottieStore((store) => store.origLottie);

  const id_enableMultiline = useId();
  const id_enableAlign = useId();

  const update = (newData: EditData<Config, Execution>) => {
    if (!onEditChanged) {
      return;
    }
    onEditChanged(newData);
  };

  const onChanged = (key: keyof Config, val: boolean) => {
    const newEdit = structuredClone(edit);
    newEdit.config = { ...newEdit.config, ...{ [key]: val } };
    update(newEdit);
  };

  const onChangeRef = (ref?: LottieRef) => {
    const targetLayerRef = ref as LayerRef | undefined;
    let newEdit = structuredClone(edit);

    newEdit.config = { ...newEdit.config, targetLayer: targetLayerRef };
    newEdit.defaults = {};
    newEdit.execution = undefined;

    //TODO: get defaults from target layer should NOT BE in the view logic!
    //get defaults from target layer:
    const origLayer = findLayerRef(origLottie, targetLayerRef);
    if (origLayer && origLayer.ty === layerTypes.text) {
      const editExecuter = editsModule.getExecuter(editTypes.text);
      if (editExecuter && origLottie) {
        newEdit = editExecuter.updateDefaults(origLottie, newEdit) as EditData<
          Config,
          Execution
        >;
      }

      newEdit.execution = newEdit.defaults;
    }
    update(newEdit);
  };

  return (
    <div className={styles.root}>
      {/* <pre>{JSON.stringify(edit, null, 2)}</pre> */}
      <label>target layer</label>
      <RefSelector
        value={edit.config.targetLayer}
        onChange={onChangeRef}
        disableShape
        allowLayerTypes={[layerTypes.text]}
      />
      <div>
        <input
          type="checkbox"
          id={id_enableMultiline}
          checked={config.enableMultiline}
          onChange={(e) => onChanged("enableMultiline", e.target.checked)}
        />
        <label htmlFor={id_enableMultiline}>enable Multiline</label>
      </div>
      <div>
        <input
          type="checkbox"
          id={id_enableAlign}
          checked={config.enableAlign}
          onChange={(e) => onChanged("enableAlign", e.target.checked)}
        />
        <label htmlFor={id_enableAlign}>enable Align</label>
      </div>
    </div>
  );
}
