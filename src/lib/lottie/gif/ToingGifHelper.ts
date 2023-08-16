import lottie from "lottie-web";
import {
  Lottie,
  ToingCampaign,
  ToingConfig,
  ToingUserExecutions,
} from "../types";
import { resolveSrcToObject as resolveSource } from "../utils/path";
import GifRenderer, { GifRendererEvents } from "./gifRenderer";
import { LottieHelper } from "../core/LottieHelper";

const FPS = 25;

const LOGO_POS = {
  x: 10,
  y: 10,
  width: 50,
  height: 50,
};

const defaultRendererSettings = {
  clearCanvas: false,
  hideOnTransparent: true,
  progressiveLoad: true,
};

export type CreateGifParams = {
  src: string | Lottie;
  config?: ToingConfig;
  execution?: ToingUserExecutions;
  campaign?: ToingCampaign;
  width?: number;
  height?: number;
  quality?: number;
  progressCallback?: (progress: number) => void;
};

export async function createGif(params: CreateGifParams): Promise<Blob> {
  const {
    src,
    execution,
    campaign,
    config,
    progressCallback,
    width,
    height,
    quality,
  } = params;

  //load
  const jsonOrig = await resolveSource<Lottie>(src);
  const json = structuredClone(jsonOrig);

  //edit
  LottieHelper.digestLottie(json, config);
  LottieHelper.executeLottieEdits(json, config, execution, campaign);

  //create container (must be a part of the document for using fonts and classes ? ... )
  const container = document.createElement("svg");
  container.style.position = "absolute";
  container.style.top = "0";
  container.style.visibility = "hidden";
  container.style.pointerEvents = "none";

  document.body.appendChild(container);

  //load animation
  const animationItem = lottie.loadAnimation({
    rendererSettings: defaultRendererSettings,
    animationData: json,
    autoplay: true,
    loop: true,
    container,
    renderer: "svg",
  });

  return new Promise<Blob>((resolve, reject) => {
    //execute
    const gifRenderer = new GifRenderer({
      animationItem,
      logoUrl: campaign?.logoUrl,
      logoPos: LOGO_POS,
      fps: animationItem.frameRate || FPS,
      width,
      height,
      quality,
    });

    //register events:

    gifRenderer.on(GifRendererEvents.start, () => {});

    gifRenderer.on(GifRendererEvents.progress, (progress: number) => {
      progressCallback && progressCallback(progress);
    });

    gifRenderer.on(
      GifRendererEvents.finished,
      (blob: Blob, data: Uint8Array) => {
        document.body.removeChild(container);
        resolve(blob);
      }
    );

    gifRenderer.on(GifRendererEvents.abort, () => {
      document.body.removeChild(container);
      reject(new Error("render has been aborted"));
    });

    //render:
    gifRenderer.start();
  });
}
