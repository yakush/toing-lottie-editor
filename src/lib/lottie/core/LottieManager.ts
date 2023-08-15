import EventEmitter from "events";
import {
  Layer,
  Lottie,
  Shape,
  ToingCampaign,
  ToingConfig,
  ToingUserExecutions,
  default_ToingCampaign,
  default_ToingConfig,
  default_ToingUserExecutions,
} from "../types";
import { LottieHelper } from "./LottieHelper";

export type updater<T> = null | undefined | T | ((current: T) => T);

function isCallbackUpdater<T>(x: updater<T>): x is (current: T) => T {
  return typeof x === "function";
}

export enum LottieManagerEvents {
  onChangeOrigLottie = "onChangeOrigLottie",
  onChangeLottie = "onChangeLottie",
  onChangeConfig = "onchangeEdits",
  onChangeExecutions = "onChangeExecutions",
  onChangeCampaign = "onChangeCampaign",
}

export class LottieManager extends EventEmitter {
  private _lottie?: Lottie;
  private _origLottie?: Lottie;

  private _config?: ToingConfig;
  private _executions?: ToingUserExecutions;
  private _campaign?: ToingCampaign;

  //-------------------------------------------------------
  // public

  get lottie() {
    return this._lottie;
  }
  get origLottie() {
    return this._origLottie;
  }
  get config() {
    return this._config;
  }
  get executions() {
    return this._executions;
  }
  get campaign() {
    return this._campaign;
  }

  //-------------------------------------------------------

  rerenderLottie() {
    this.setLottie({ ...this.lottie });
  }

  //-------------------------------------------------------

  loadNewLottie(lottie?: Lottie) {
    this._origLottie = lottie && structuredClone(lottie);
    this.emit(LottieManagerEvents.onChangeOrigLottie, this.origLottie);
    this.setLottie(lottie);
  }

  loadNewConfig(config: ToingConfig) {
    this.setConfig(config);
  }

  loadNewExecutions(executions: ToingUserExecutions) {
    this.setExecutions(executions);
  }

  loadNewCampaign(campaign: ToingCampaign) {
    this.setCampaign(campaign);
  }

  //-------------------------------------------------------

  updateConfig(update: updater<ToingConfig>) {
    let newVal: ToingConfig;

    if (isCallbackUpdater(update)) {
      newVal = update(this._config || default_ToingConfig);
    } else {
      newVal = update as ToingConfig;
    }

    this.setConfig(newVal, false);
  }

  updateExecutions(update: updater<ToingUserExecutions>) {
    let newVal: ToingUserExecutions;

    if (isCallbackUpdater(update)) {
      newVal = update(this._executions || default_ToingUserExecutions);
    } else {
      newVal = update as ToingUserExecutions;
    }

    this.setExecutions(newVal);
  }

  updateCampaign(update: updater<ToingCampaign>) {
    let newVal: ToingCampaign;

    if (isCallbackUpdater(update)) {
      newVal = update(this._campaign || default_ToingCampaign);
    } else {
      newVal = update as ToingCampaign;
    }

    this.setCampaign(newVal);
  }

  private setLottie(
    val?: Lottie,
    options?: { digest?: boolean; updateFromEdits?: boolean }
  ) {
    options = {
      ...{
        digest: true,
        updateFromEdits: true,
      },
      ...options,
    };
    const { digest, updateFromEdits } = options;

    if (val === this.lottie) {
      return;
    }

    this._lottie = val;

    if (val && digest) {
      this.digestLottie();
    }

    if (val && updateFromEdits) {
      this.updateFromEdits();
    }

    this.emit(LottieManagerEvents.onChangeLottie, this.lottie);
  }

  private setConfig(val?: ToingConfig, digest = true) {
    if (val === this.config) {
      return;
    }

    this._config = val;

    if (val && digest) {
      this.digestLottie();
    }

    this.updateFromEdits();

    this.emit(LottieManagerEvents.onChangeConfig, this.config);
  }

  private setExecutions(val?: ToingUserExecutions) {
    if (val === this.executions) {
      return;
    }
    this._executions = val;
    this.updateFromEdits();
    this.emit(LottieManagerEvents.onChangeExecutions, this.executions);
  }

  private setCampaign(val?: ToingCampaign) {
    if (val === this.campaign) {
      return;
    }
    this._campaign = val;
    this.updateFromEdits();
    this.emit(LottieManagerEvents.onChangeCampaign, this.campaign);
  }

  resetExecutions() {
    if (!this.config) {
      return;
    }

    this._executions = {
      executions: {},
    };

    this.updateFromEdits();
  }

  //-------------------------------------------------------

  blinkShape(target: Shape) {
    const allTargets = LottieHelper.collectSubShapesTargets(target);
    this.performBlinkList(allTargets);
  }

  blinkLayer(target: Layer) {
    const allTargets = LottieHelper.collectSubShapesTargets(target);
    this.performBlinkList(allTargets);
  }

  blinkTargetList(targets: (Shape | Layer)[]) {
    let allTargets: (Shape | Layer)[] = [];
    targets.forEach((target) => {
      const subTargets = LottieHelper.collectSubShapesTargets(target);
      allTargets.push(...subTargets);
    });
    this.performBlinkList(allTargets);
  }

  private performBlinkList(targets: (Shape | Layer)[]) {
    if (targets.some((target) => (target as any).isBlinking)) {
      return;
    }

    let count = 4;
    const TIME = 150;
    targets.forEach((target) => {
      (target as any).isBlinking = true;
      (target as any).blinkingOrigHd = target.hd;
    });

    const blinkOnce = () => {
      //next
      if (count > 0) {
        setTimeout(() => {
          targets.forEach((target) => {
            target.hd = true;
          });
          this.setLottie(
            { ...this.lottie },
            { digest: false, updateFromEdits: false }
          );
        }, TIME / 2);
        setTimeout(() => {
          targets.forEach((target) => {
            target.hd = false;
          });
          this.setLottie(
            { ...this.lottie },
            { digest: false, updateFromEdits: false }
          );
          blinkOnce();
        }, TIME);
      } else {
        targets.forEach((target) => {
          target.hd = (target as any).blinkingOrigHd;
          delete (target as any).isBlinking;
          delete (target as any).blinkingOrigHd;
        });
      }
      count--;
    };

    blinkOnce();
  }

  //-------------------------------------------------------
  /**
   * prepare JSONs after loading them.
   * layer refs, color refs
   * JSON : add origs and stuff
   * JSON -> config refs etc.
   * @returns
   */
  private digestLottie() {
    // console.log("DIGESTING LOTTIE");
    LottieHelper.digestLottie(this.lottie, this.config);
  }
  //-------------------------------------------------------

  private updateFromEdits() {
    const { lottie, config } = this;
    if (!lottie) {
      return;
    }
    if (!config) {
      return;
    }

    LottieHelper.executeLottieEdits(
      lottie,
      config,
      this.executions,
      this.campaign
    );

    this.setLottie({ ...lottie }, { digest: false, updateFromEdits: false });
  }
}
