import React from "react";
import { textJustifications } from "../enums/textJustifications";
import { combineClasses } from "../utils/css";
import styles from "./TextAlignSelector.module.css";

type Props = {
  value?: textJustifications;
  onChange?: (value: textJustifications) => void;
};

const options = [
  { label: "<", option: textJustifications.LEFT_JUSTIFY },
  { label: "-", option: textJustifications.CENTER_JUSTIFY },
  { label: ">", option: textJustifications.RIGHT_JUSTIFY },
  { label: "<<", option: textJustifications.FULL_JUSTIFY_LASTLINE_LEFT },
  { label: "--", option: textJustifications.FULL_JUSTIFY_LASTLINE_CENTER },
  { label: ">>", option: textJustifications.FULL_JUSTIFY_LASTLINE_RIGHT },
  { label: "||", option: textJustifications.FULL_JUSTIFY_LASTLINE_FULL },
];

export default function TextAlignSelector({ value, onChange }: Props) {
  return (
    <div className={styles.root}>
        <div className={styles.buttons}>

        
      {options.map(({ label, option }) => (
        <button
          key={option}
          className={combineClasses(styles.btn, {
            [styles.selected]: option === value,
          })}
          onClick={(e) => onChange && onChange(option)}
        >
          {label}
        </button>
      ))}
      </div>
    </div>
  );
}
