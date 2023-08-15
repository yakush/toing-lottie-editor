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
        //copy it so children can't update it
        const orig = await resolveSrcToObject<Lottie>(props.toingData?.src);
        const json = orig ? structuredClone(orig) : orig;
        setLottie(json);
      } catch (e) {
        setLottie(undefined);
        console.warn(e);
      }
    };
    run();
  }, [props.toingData?.src, setLottie]);

  useEffect(() => {
    //copy it so children can't update it
    const orig = props.toingData?.config;
    const json = orig ? structuredClone(orig) : orig;
    setConfig(json);
  }, [props.toingData?.config, setConfig]);

  useEffect(() => {
    //copy it so children can't update it
    const orig = props.toingData?.campaign;
    const json = orig ? structuredClone(orig) : orig;
    setCampaign(json);
  }, [props.toingData?.campaign, setCampaign]);

  useEffect(() => {
    const orig = props.toingData?.execution;
    const json = orig ? structuredClone(orig) : orig;
    setExecutions(json);
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
