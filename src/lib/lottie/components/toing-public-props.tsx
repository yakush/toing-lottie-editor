import {
  Lottie,
  ToingCampaign,
  ToingConfig,
  ToingUserExecutions,
} from "../types";

export type ToingData = {
  src: string | Lottie;
  config?: ToingConfig;
  execution?: ToingUserExecutions;
  campaign?: ToingCampaign;
};

export type ToingPublicProps = {
  toingData: ToingData;
};
