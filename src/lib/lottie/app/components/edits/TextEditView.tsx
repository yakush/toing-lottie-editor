import React from "react";
import { EditProps } from "../../uiModule";
import { Config, Execution } from "../../../edits/editTypes/editText";

export default function TextEditView({
  edit,
  onEditChanged,
}: EditProps<Config, Execution>) {
  return (
    <div onClick={() => onEditChanged && onEditChanged(edit)}>
      [{edit.id}] text: {edit.name}
      {/* <pre>{JSON.stringify(edit.config, null, 2)}</pre> */}
    </div>
  );
}
