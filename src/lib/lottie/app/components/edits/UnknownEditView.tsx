import React from "react";
import { EditProps } from "../../uiModule";


export default function UnknownEditView({editEndpoint}: EditProps) {
  return <div>unknown edit {editEndpoint.type}</div>;
}
