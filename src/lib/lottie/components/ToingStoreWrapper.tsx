import React, { ReactNode, useEffect } from "react";
import {
  Lottie,
  ToingCampaign,
  ToingConfig,
  ToingUserExecutions,
} from "../types";

import useToingStore, { LottieStoreProvider } from "../stores/ToingStore";
import { resolveSrcToObject } from "../utils/path";

type Props = {
  src: string | Lottie;
  config?: ToingConfig;
  execution?: ToingUserExecutions;
  campaign?: ToingCampaign;
};

type PropsWithChildren = Props & {
  children?: ReactNode;
};

function ToingStoreWrapper(props: PropsWithChildren) {
  return (
    <LottieStoreProvider displayName="wrapper">
      <Inner {...props} />
    </LottieStoreProvider>
  );
}

//-------------------------------------------------------
//-------------------------------------------------------

function Inner(props: PropsWithChildren) {
  const setLottie = useToingStore((store) => store.setLottie);
  const setConfig = useToingStore((store) => store.setConfig);
  const setExecutions = useToingStore((store) => store.setExecutions);
  const setCampaign = useToingStore((store) => store.setCampaign);

  useEffect(() => {
    const run = async () => {
      try {
        const json = await resolveSrcToObject<Lottie>(props.src);
        setLottie(json);
      } catch (e) {
        setLottie(undefined);
        console.warn(e);
      }
    };
    run();
  }, [props.src, setLottie]);

  useEffect(() => {
    setConfig(props.config);
  }, [props.config, setConfig]);

  useEffect(() => {
    setCampaign(props.campaign);
  }, [props.campaign, setCampaign]);

  useEffect(() => {
    setExecutions(props.execution);
  }, [props.execution, setExecutions]);

  return <>{props.children}</>;
}

//-------------------------------------------------------
export const withToingStore =
  <P extends Props>(Component: React.ComponentType<P>) =>
  (props: P) => {
    return (
      <ToingStoreWrapper {...props}>
        <Component {...props} />
      </ToingStoreWrapper>
    );
  };

export { ToingStoreWrapper };
export default ToingStoreWrapper;
