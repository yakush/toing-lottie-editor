export interface ToingCampaignTextEntry {
  text: string;
  color: string;
}

export interface ToingCampaign {
  //todo: ToingCampaign type
  logoUrl: string;
  colors: {
    primary: string;
    secondary: string;
  };
  texts: {
    title: ToingCampaignTextEntry;
  };
}

//-------------------------------------------------------

export const default_ToingCampaign: ToingCampaign = {
  logoUrl: "",
  colors: {
    primary: "#000",
    secondary: "#fff",
  },
  texts: {
    title: {
      text: "no text",
      color: "#000",
    },
  },
};
