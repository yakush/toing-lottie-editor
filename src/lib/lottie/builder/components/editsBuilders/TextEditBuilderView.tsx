import React, { Key, useId } from "react";
import { EditBuilderProps } from "../../builderUiModule";
import { Config, Execution } from "../../../edits/editTypes/editText";
import BuilderCardHeader from "../BuilderCardHeader";
import BuilderCard from "../BuilderCard";
import styles from "./TextEditBuilderView.module.css";

type Props = EditBuilderProps<Config, Execution>;

export default function TextEditBuilderView({ edit, onEditChanged }: Props) {
  const { config } = edit;

  const id_enableMultiline = useId();
  const id_enableAlign = useId();
  const id_enableColor = useId();

  const update = (updates: Partial<Config>) => {
    if (!onEditChanged) {
      return;
    }
    const newEdit = structuredClone(edit);
    newEdit.config = { ...newEdit.config, ...updates };
    onEditChanged(newEdit);
  };

  const onChanged = (key: keyof Config, val: boolean) => {    
    update({
      [key]: val,
    });
  };

  return (
    <div className={styles.root}>
      <BuilderCard>
        <BuilderCardHeader>[text]</BuilderCardHeader>
        <div>
          <div>
            <input
              type="checkbox"
              id={id_enableMultiline}
              checked={config.enableMultiline}
              onChange={(x) => onChanged("enableMultiline", x.target.checked)}
            />
            <label htmlFor={id_enableMultiline}>enable Multiline</label>
          </div>
          <div>
            <input
              type="checkbox"
              id={id_enableAlign}
              checked={config.enableAlign}
              onChange={(x) => onChanged("enableAlign", x.target.checked)}
            />
            <label htmlFor={id_enableAlign}>enable Align</label>
          </div>
          <div>
            <input
              type="checkbox"
              id={id_enableColor}
              checked={config.enableColor}
              onChange={(x) => onChanged("enableColor", x.target.checked)}
            />
            <label htmlFor={id_enableColor}>enable Color</label>
          </div>
        </div>
      </BuilderCard>
    </div>
  );
}
