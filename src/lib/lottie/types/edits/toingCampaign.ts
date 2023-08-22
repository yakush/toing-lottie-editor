import { PaletteOption } from "../../core/colorSchema";

export interface ToingCampaignTextEntry {
  text: string;
  color: string;
}

export interface ToingCampaign {
  logoUrl?: string;

  colors?: PaletteOption[];

  texts?: {
    title?: ToingCampaignTextEntry;
    subtitle?: ToingCampaignTextEntry;
  };
}

//-------------------------------------------------------

export const default_ToingCampaign: ToingCampaign = {
  logoUrl: "",

  colors: [
    {
      name: "brand",
      description: "brand colors",
      colors: {
        primary: "#000",
        secondary: "#fff",
      },
    },
  ],

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
