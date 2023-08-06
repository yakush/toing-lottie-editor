import { EventEmitter } from "events";
import GIF from "gif.js";
import { AnimationItem } from "lottie-web";

const DEBUG = false;

const FRAME_ADD_DELAY = 1;
const WORKERS = 2;
const QUALITY = 3;
const BACKGROUND = "#fff";

function logDebug(...args: any[]) {
  if (DEBUG) {
    console.log(...args);
  }
}

function createPublicUrl(file: string) {
  return `${process.env.PUBLIC_URL}/${file}`;
}

export type LogoPos = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export enum GifRendererEvents {
  start = "start",
  progress = "progress",
  abort = "abort",
  finished = "finished",
}

class GifRenderer extends EventEmitter {
  private gif: GIF;
  private animationItem: AnimationItem;
  private svg: SVGElement;
  private fps = 25;

  private totalFrames = 0;
  private frame = 0;
  private isStarted = false;

  private saved_currentFrame: number = 0;
  private saved_isPaused: boolean = false;
  private width: number;
  private height: number;

  private logoUrl?: string;
  private logoPos?: LogoPos;

  constructor({
    width,
    height,
    animationItem,
    fps = 25,
    logoUrl,
    logoPos,
  }: {
    width: number;
    height: number;
    animationItem: AnimationItem;
    fps?: number;

    logoUrl?: string;
    logoPos?: LogoPos;
  }) {
    super();

    this.width = width;
    this.height = height;
    this.logoUrl = logoUrl;
    this.logoPos = logoPos;
    this.animationItem = animationItem;
    this.svg = animationItem.renderer.svgElement;
    this.fps = fps;

    this.gif = new GIF({
      workerScript: createPublicUrl("gif.worker.js"),
      width,
      height,
      workers: WORKERS,
      quality: QUALITY,
      background: BACKGROUND,
    });
  }

  async start() {
    if (this.isStarted) {
      throw new Error("Gif renderer already started");
    }

    this.isStarted = true;

    //create elements
    const imgFrame = new Image();
    imgFrame.width = this.width;
    imgFrame.height = this.height;

    const imgLogo = new Image();

    if (this.logoUrl) {
      await loadImageAndWait(imgLogo, this.logoUrl);
    }

    const canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;
    if (!canvas.getContext) {
      throw new Error("canvas get context not supported");
    }
    const ctx = canvas.getContext("2d");
    if (ctx == null) {
      throw new Error("unable to get canvas 2d context");
    }

    this.totalFrames = this.animationItem.totalFrames;
    this.frame = 0;

    logDebug("totalFrames :", this.totalFrames);
    logDebug("frameRate :", this.animationItem.frameRate);
    logDebug("width:", +(this.svg?.getAttribute("width") || 100));
    logDebug("height:", +(this.svg?.getAttribute("height") || 100));

    //save state:
    this.saveState();

    this.gif.on("start", () => this.handleStart);
    this.gif.on("progress", (progress) => this.handleProgress(progress));
    this.gif.on("finished", (blob, data) => this.handleFinished(blob, data));
    this.gif.on("abort", () => this.handleAbort());

    //start:
    this.emit(GifRendererEvents.start);
    this.emit(GifRendererEvents.progress, 0);

    const addFrame = () => {
      logDebug("frame", this.frame);

      this.animationItem.goToAndStop(this.frame, true);
      const serialized = new XMLSerializer().serializeToString(this.svg);
      const svgBlob = new Blob([serialized], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);

      const imageFrame = this.frame;
      imgFrame.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //frame
        ctx.drawImage(imgFrame, 0, 0);

        //logo:
        if (this.logoUrl && this.logoPos) {
          const logoFit = scaleToFit(
            imgLogo,
            this.logoPos.width,
            this.logoPos.height
          );

          ctx.drawImage(
            imgLogo,
            this.logoPos.x + logoFit.offsetX,
            this.height -
              this.logoPos.y -
              this.logoPos.height +
              logoFit.offsetY,
            logoFit.width,
            logoFit.height
          );

          if (DEBUG) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "red";
            ctx.rect(
              this.logoPos.x,
              this.height - this.logoPos.y - this.logoPos.height,
              this.logoPos.width,
              this.logoPos.height
            );
            ctx.stroke();
          }
        }

        this.gif.addFrame(canvas, {
          delay: 1000 / this.fps,
          copy: true,
        });

        setTimeout(() => {
          if (imageFrame + 1 >= this.totalFrames) {
            this.finish();
          } else {
            //note: half is images, half is gif render
            this.emit(
              GifRendererEvents.progress,
              0.5 * (imageFrame / this.totalFrames)
            );
            addFrame();
          }
        }, FRAME_ADD_DELAY);
      };

      imgFrame.src = url;
      this.frame++;
    };

    addFrame();
  }

  abort() {
    this.gif.abort();
  }

  //-------------------------------------------------------
  //event handlers
  private handleStart() {
    this.emit(GifRendererEvents.start);
  }
  private handleProgress(progress: number) {
    //note: half is images, half is gif render
    this.emit(GifRendererEvents.progress, 0.5 + progress / 2);
  }
  private handleFinished(blob: Blob, data: Uint8Array) {
    this.restoreState();
    this.emit(GifRendererEvents.finished, blob, data);
  }
  private handleAbort() {
    this.restoreState();
    this.emit(GifRendererEvents.abort);
  }

  //-------------------------------------------------------
  private saveState() {
    this.saved_currentFrame = this.animationItem.currentFrame;
    this.saved_isPaused = this.animationItem.isPaused;
  }

  private restoreState() {
    if (this.saved_isPaused) {
      this.animationItem.goToAndStop(this.saved_currentFrame, true);
    } else {
      this.animationItem.goToAndPlay(this.saved_currentFrame, true);
    }
  }

  private finish() {
    this.gif.render();
  }
}

async function loadImageAndWait(img: HTMLImageElement, src: string) {
  return new Promise<void>((resolve, reject) => {
    img.onerror = (e) => reject(e);
    img.onload = () => resolve();
    img.src = src;
  });
}

function scaleToFit(
  img: HTMLImageElement,
  maxWidth: number,
  maxHeight: number
) {
  const { width: imgWidth, height: imgHeight } = img;

  const [width, height] =
    imgWidth > imgHeight
      ? //wide
        [maxWidth, maxWidth * (imgHeight / imgWidth)]
      : //tall
        [maxHeight * (imgWidth / imgHeight), maxHeight];

  const offsetX = (maxWidth - width) / 2;
  const offsetY = (maxHeight - height) / 2;

  return {
    width,
    height,
    offsetX,
    offsetY,
  };
}

export default GifRenderer;
