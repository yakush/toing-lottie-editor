import { EditProps } from "../../modules/editorUiModule";

export default function UnknownEditView({ editEndpoint }: EditProps) {
  return <div>unknown edit {editEndpoint.type}</div>;
}
