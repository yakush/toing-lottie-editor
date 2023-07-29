import {
  EditData,
  EditExecuter,
  Lottie,
  TextLayer,
  editTypes,
  layerTypes,
} from "../../core";
import { textJustifications } from "../../core/enums/textJustifications";
import { LayerRef } from "../../core/types/edits/lottieRef";
import { findLayerRef } from "../../utils/lottieUtils";

export interface Config {
  targetLayer: LayerRef;
  enableMultiline: boolean;
  enableAlign: boolean;
  enableColor: boolean;
}

export interface Execution {
  text?: string;
  align?: number;
  color?: string;
}

export default class EditText implements EditExecuter<Config, Execution> {
  type = editTypes.text;

  execute(lottie: Lottie, edit: EditData<Config, Execution>) {
    const { config, execution } = edit;
    const target: TextLayer = findLayerRef(
      lottie,
      config.targetLayer
    ) as TextLayer;

    if (!target) {
      console.warn("couldn't find target from ref");
      console.log(config.targetLayer);
      return;
    }
    if (target.ty !== layerTypes.text) {
      console.warn("target is not a text layer");
      console.log(config.targetLayer);
      console.log(target);
      return;
    }


    //text
    let text = execution?.text;
    if (text == null) {
      text = "";
    }
    if (text === "") {
      text = " ";
    }

    //all breaks should be "\r"
    text = text.replace(/\r\n/gm, "\r").replace(/\n/gm, "\r");

    if (target.t?.d?.k && target.t?.d?.k[0] && target.t?.d?.k[0].s?.t) {
      target.t.d.k[0].s.t = text;
    }

    //align
    if (edit.config.enableAlign) {
      let justification = execution?.align;
      if (justification == null) {
        justification = textJustifications.CENTER_JUSTIFY;
      }

      if (target.t?.d?.k && target.t?.d?.k[0] && target.t?.d?.k[0].s) {
        target.t.d.k[0].s.j = execution?.align;
      }
      
    }
  }
}
