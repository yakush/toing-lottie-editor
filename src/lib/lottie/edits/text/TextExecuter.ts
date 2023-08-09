import { editTypes, layerTypes, textJustifications } from "../../enums";
import {
  EditEndpointExecuter,
  LayerRef,
  Lottie,
  TextLayer,
  ToingCampaign,
  ToingEditEndpoint,
} from "../../types";
import { findLayerRef } from "../../utils/lottieUtils";

export interface Config {
  targetLayer?: LayerRef;
  enableMultiline: boolean;
  enableAlign: boolean;

  campaignSlot?: "title" | "subtitle";
}

export interface Execution {
  text?: string;
  align?: number;
}

export default class TextExecuter
  implements EditEndpointExecuter<Config, Execution>
{
  type = editTypes.text;

  createNewConfig(): Config {
    return {
      //targetLayer
      enableAlign: false,
      enableMultiline: true,
    };
  }

  createNewDefaults(
    lottie: Lottie | undefined,
    edit: ToingEditEndpoint<Config, Execution>
  ): Execution {
    const targetLayer = findLayerRef(lottie, edit?.config?.targetLayer);

    let defaults: Execution = {};

    if (targetLayer && targetLayer.ty === layerTypes.text) {
      const textLayer = targetLayer as TextLayer;
      defaults = {
        align:
          textLayer.t?.d?.k?.at(0)?.s?.j || textJustifications.CENTER_JUSTIFY,
        text: textLayer.t?.d?.k?.at(0)?.s?.t || "TEXT",
      };
    }
    return defaults;
  }

  execute(
    lottie: Lottie,
    editEndpoint: ToingEditEndpoint<Config, Execution>,
    campaign?: ToingCampaign,
    execution?: Execution
  ) {
    const { config, defaults } = editEndpoint;

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

    //defaults
    let text = defaults.text;
    let justification = defaults?.align;

    //campaign slot:
    if (
      config.campaignSlot &&
      campaign?.texts &&
      campaign?.texts[config.campaignSlot] &&
      campaign?.texts[config.campaignSlot]?.text
    ) {
      text = campaign.texts[config.campaignSlot]?.text;
    }

    //execution
    if (execution?.text) {
      text = execution?.text;
    }
    if (execution?.align) {
      justification = execution?.align;
    }

    //normalize
    if (text == null) {
      text = "";
    }
    if (text === "") {
      text = " ";
    }
    //all breaks should be "\r"
    text = text.replace(/\r\n/gm, "\r").replace(/\n/gm, "\r");

    //set text
    if (target.t?.d?.k && target.t?.d?.k[0] && target.t?.d?.k[0].s?.t) {
      target.t.d.k[0].s.t = text;
    }

    if (justification == null) {
      justification = textJustifications.CENTER_JUSTIFY;
    }

    //set align
    if (config.enableAlign) {
      if (target.t?.d?.k && target.t?.d?.k[0] && target.t?.d?.k[0].s) {
        target.t.d.k[0].s.j = execution?.align;
      }
    }
  }
}
