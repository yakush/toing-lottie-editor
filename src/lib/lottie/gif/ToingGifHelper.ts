import Lottie, { AnimationItem } from "lottie-web";
import GifRenderer, { GifRendererEvents } from "./gifRenderer";

const LOGO_POS = {
  x: 10,
  y: 10,
  width: 30,
  height: 30,
};

export type CreateGifParams = {
  url: string;
  config: {};
  execution: {};
  campaign: { logoUrl: string };

  width: number;
  height: number;

  progressCallback: (progress: number) => void;
};

export async function createGif(params: CreateGifParams): Promise<Blob> {
  const { url, execution, campaign, config, width, height, progressCallback } =
    params;

  const { animationData, container, instance } = await createLottie(url);

  //todo: execute execution, config, executions,...

  return new Promise<Blob>((resolve, reject) => {
    //execute
    const gifRenderer = new GifRenderer({
      animationItem: instance,
      width,
      height,
      logoUrl: campaign.logoUrl,
      logoPos: LOGO_POS,
      fps: 25,
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

//-------------------------------------------------------

const defaultRendererSettings = {
  clearCanvas: false,
  hideOnTransparent: true,
  progressiveLoad: true,
};

async function createLottie(url: string): Promise<{
  animationData: string;
  container: Element;
  instance: AnimationItem;
}> {
  const animationData = await (await fetch(url)).json();
  const container = document.createElement("svg");

  // Initialize lottie player and load animation
  const instance = Lottie.loadAnimation({
    rendererSettings: defaultRendererSettings,
    animationData,
    autoplay: true,
    loop: true,
    container,
    renderer: "svg",
  });

  return {
    animationData,
    container,
    instance,
  };
}
