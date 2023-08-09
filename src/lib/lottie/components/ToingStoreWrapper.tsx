import React, { ReactNode, useEffect } from "react";
import useToingStore, { LottieStoreProvider } from "../stores/ToingStore";
import { Lottie } from "../types";
import { resolveSrcToObject } from "../utils/path";
import { ToingPublicProps } from "./toing-public-props";

type PropsWithChildren = ToingPublicProps & {
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
        const json = await resolveSrcToObject<Lottie>(props.toingData?.src);
        setLottie(json);
      } catch (e) {
        setLottie(undefined);
        console.warn(e);
      }
    };
    run();
  }, [props.toingData?.src, setLottie]);

  useEffect(() => {
    setConfig(props.toingData?.config);
  }, [props.toingData?.config, setConfig]);

  useEffect(() => {
    setCampaign(props.toingData?.campaign);
  }, [props.toingData?.campaign, setCampaign]);

  useEffect(() => {
    setExecutions(props.toingData?.execution);
  }, [props.toingData?.execution, setExecutions]);

  return <>{props.children}</>;
}

//-------------------------------------------------------

/** wrapper for components. puts a toing-store around the component */
export const withToingStore =
  <P extends ToingPublicProps>(Component: React.ComponentType<P>) =>
  (props: P) => {
    return (
      <ToingStoreWrapper {...props}>
        <Component {...props} />
      </ToingStoreWrapper>
    );
  };

export { ToingStoreWrapper };
export default ToingStoreWrapper;
