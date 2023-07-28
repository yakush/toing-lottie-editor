import React from "react";
import { EditProps } from "../../uiModule";
import { Config, Execution } from "../../../edits/editTypes/editText";

export default function TextEditView({
  edit,
  onEditChanged,
}: EditProps<Config, Execution>) {
  const onClick = () => {
    const newEdit = { ...edit };

    newEdit.execution = {
      text: "NEW TEXT!" + Math.round(Math.random() * 1000),
    };
    onEditChanged && onEditChanged(newEdit);
  };

  return (
    <div onClick={onClick}>
      [{edit.id}] text: {edit.name}
      {/* <pre>{JSON.stringify(edit.config, null, 2)}</pre> */}
    </div>
  );
}
