import React from "react";
import { EditProps } from "../../uiModule";


export default function UnknownEditView({edit}: EditProps) {
  return <div>unknown edit {edit.type}</div>;
}
