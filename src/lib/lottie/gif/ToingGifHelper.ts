import lottie from "lottie-web";
import { executeLottieEdits } from "../utils/lottieUtils";
import GifRenderer, { GifRendererEvents } from "./gifRenderer";
import { resolveSrcToObject as resolveSource } from "../utils/path";
import { Lottie, ToingCampaign, ToingConfig, ToingUserExecutions } from "../types";

const FPS = 25;

const LOGO_POS = {
  x: 10,
  y: 10,
  width: 30,
  height: 30,
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
  progressCallback?: (progress: number) => void;
};

export async function createGif(params: CreateGifParams): Promise<Blob> {
  const { src, execution, campaign, config, progressCallback, width, height } =
    params;

  //load
  const json = await resolveSource<Lottie>(src);

  executeLottieEdits(json, config, execution, campaign);

  //load animation
  const container = document.createElement("svg");
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
    });

    //register events:

    gifRenderer.on(GifRendererEvents.start, () => {});

    gifRenderer.on(GifRendererEvents.progress, (progress: number) => {
      progressCallback && progressCallback(progress);
    });

    gifRenderer.on(
      GifRendererEvents.finished,
      (blob: Blob, data: Uint8Array) => {
        resolve(blob);
      }
    );

    gifRenderer.on(GifRendererEvents.abort, () => {
      reject(new Error("render has been aborted"));
    });

    //render:
    gifRenderer.start();
  });
}
