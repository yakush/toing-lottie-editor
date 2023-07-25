import { TextLayer } from "../../../core";
import { LayerProps } from "../../builderUiModule";

const BuilderTextLayer = ({ layer }: LayerProps<TextLayer>) => {
  return <>text {JSON.stringify(layer)} </>;
};

export default BuilderTextLayer;
