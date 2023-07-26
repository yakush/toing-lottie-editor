import EventEmitter from "events";
import { EditData, GroupShape, Layer, Lottie, Shape } from "./types";
import registry from "../edits/editsModule";
import { shapeTypes } from "./enums";

type updater<T> = T | ((current: T) => T);

function isCallbackUpdater<T>(x: updater<T>): x is (current: T) => T {
  return typeof x === "function";
}

export enum LottieManagerEvents {
  onChangeLottie = "onChangeJson",
  onChangeEdits = "onchangeEdits",
}

export class LottieManager extends EventEmitter {
  private _lottie?: Lottie;
  private _edits?: EditData[];

  //-------------------------------------------------------
  // public

  get lottie() {
    return this._lottie;
  }

  get edits() {
    return this._edits;
  }

  loadNewLottie(lottie?: Lottie, edits?: EditData[]) {
    //TODO:implement
    this.setLottie(lottie, { digest: false, emitEvent: false });
    this.setEdits(edits, false);
    this.digestLottie();

    this.emit(LottieManagerEvents.onChangeLottie, this.lottie);
    this.emit(LottieManagerEvents.onChangeEdits, this.edits);
  }

  loadNewEdits(edits: EditData[]) {
    //TODO:implement
    this.setEdits(edits);

    this.emit(LottieManagerEvents.onChangeEdits, this.edits);
  }

  updateLottie(update: updater<Lottie>) {
    let newVal: Lottie;

    if (isCallbackUpdater(update)) {
      if (!this._lottie) {
        throw new Error("cannot update lottie, current lottie is undefined");
      }
      newVal = update(this._lottie);
    } else {
      newVal = update as Lottie;
    }

    this._lottie = newVal;
    //events
  }

  updateEdits(
    update: updater<EditData[]>,
    hints?: {
      changed?: "executions" | "configs";
    }
  ) {
    let newVal: EditData[];

    if (isCallbackUpdater(update)) {
      if (!this._edits) {
        throw new Error("cannot update edits, current edits is undefined");
      }
      newVal = update(this._edits);
    } else {
      newVal = update as EditData[];
    }

    const changedConfigs =
      hints?.changed === "configs" || hints?.changed === undefined;
    const changedExecutions =
      hints?.changed === "executions" || hints?.changed === undefined;

    this.setEdits(newVal);

    if (changedConfigs) {
      //create defaults if needed
      //events
    }

    if (changedExecutions) {
      //events
    }

    //events
  }

  private setLottie(
    val?: Lottie,
    options?: { digest?: boolean; emitEvent?: boolean }
  ) {
    options = {
      ...{
        digest: true,
        emitEvent: true,
      },
      ...options,
    };
    const { digest, emitEvent } = options;

    if (val === this.lottie) {
      return;
    }

    this._lottie = val;

    if (val && digest) {
      this.digestLottie();
    }

    if (emitEvent) {
      this.emit(LottieManagerEvents.onChangeLottie, this.lottie);
    }
  }

  private setEdits(val?: EditData[], digest = true) {
    if (val === this.lottie) {
      return;
    }

    this._edits = val;

    if (val && digest) {
      this.digestLottie();
    }

    this.emit(LottieManagerEvents.onChangeEdits, this.edits);
  }

  resetDefaults() {
    if (!this.edits) {
      return;
    }
    registry.setDefaultsAll(this.edits);
    this.updateFromEdits();
  }

  blinkShape(target: Shape) {
    //add shape and sub shapes in groups
    let allTargets: Shape[] = [];
    
    function addSubTargets(shape: Shape) {
      allTargets.push(shape);
      if (shape.ty === shapeTypes.group) {
        (shape as GroupShape).it?.map(addSubTargets);
      }
    }

    addSubTargets(target);

    this.blinkTarget(allTargets);
  }

  blinkLayer(target: Layer) {
    this.blinkTarget([target]);
  }

  private blinkTarget(targets: (Shape | Layer)[]) {
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
          this.setLottie({ ...this.lottie }, { digest: false });
        }, TIME / 2);
        setTimeout(() => {
          targets.forEach((target) => {
            target.hd = false;
          });
          this.setLottie({ ...this.lottie }, { digest: false });
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
    console.log("DIGEST");

    if (!this.lottie) {
      return;
    }
    if (!this.edits) {
      return;
    }

    registry.setDefaultsAll(this.edits);

    //perform initial edits
    this.updateFromEdits();
  }
  //-------------------------------------------------------

  private updateFromEdits() {
    const { lottie, edits } = this;
    if (!lottie) {
      return;
    }
    if (!edits) {
      return;
    }

    registry.executeAll(lottie, edits);
    this.setLottie({ ...lottie }, { digest: false });
  }
}
