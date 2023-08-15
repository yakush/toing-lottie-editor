import { PartialColorsPalette } from "../../core/colorSchema";

export interface ToingCampaignTextEntry {
  text: string;
  color: string;
}

export interface ToingCampaign {
  logoUrl?: string;

  colors?: PartialColorsPalette;
  texts?: {
    title?: ToingCampaignTextEntry;
    subtitle?: ToingCampaignTextEntry;
  };
}

//-------------------------------------------------------

export const default_ToingCampaign: ToingCampaign = {
  logoUrl: "",
  colors: {
    primary1: "#000",
    primary2: "#fff",
  },
  texts: {
    title: {
      text: "no text",
      color: "#000",
    },
    subtitle: {
      text: "no text",
      color: "#000",
    },
  },
};
