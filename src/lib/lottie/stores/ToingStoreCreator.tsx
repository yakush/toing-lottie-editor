import { StateCreator } from "zustand";
import {
  LottieManager,
  LottieManagerEvents,
  updater,
} from "../core/LottieManager";
import {
  Layer,
  Lottie,
  Shape,
  ToingCampaign,
  ToingConfig,
  ToingUserExecutions,
} from "../types";

export interface ToingStore {
  displayName: string;
  manager: LottieManager;
  lottie?: Lottie;
  origLottie?: Lottie;
  config?: ToingConfig;
  userExecutions?: ToingUserExecutions;
  campaign?: ToingCampaign;

  rerenderLottie: () => void;

  setLottie: (lottie: Lottie | undefined) => void;
  setConfig: (update: updater<ToingConfig>) => void;
  setExecutions: (update: updater<ToingUserExecutions>) => void;
  setCampaign: (update: updater<ToingCampaign>) => void;

  resetExecutions: () => void;

  blinkLayer: (target: Layer) => void;
  blinkShape: (target: Shape) => void;
  blinkTargetList: (target: (Layer | Shape)[]) => void;
}

export const ToingStoreCreatorFactory: (
  displayName?: string
) => StateCreator<ToingStore> =
  (displayName: string = "lottie store") =>
  (set, get, a) => {
    const manager = new LottieManager();

    //events
    //TODO: when do i unsubscribe store events?
    manager.on(LottieManagerEvents.onChangeOrigLottie, (origLottie) =>
      set({ origLottie })
    );
    manager.on(LottieManagerEvents.onChangeLottie, (lottie) => set({ lottie }));
    manager.on(LottieManagerEvents.onChangeConfig, (config) => set({ config }));
    manager.on(LottieManagerEvents.onChangeExecutions, (userExecutions) =>
      set({ userExecutions })
    );
    manager.on(LottieManagerEvents.onChangeCampaign, (campaign) =>
      set({ campaign })
    );

    //-------------------------------------------------------
    // STORE :
    return {
      displayName,
      manager,
      lottie: undefined,
      origLottie: undefined,
      config: undefined,
      userExecutions: undefined,
      campaign: undefined,
      isLoading: false,
      errorLoading: undefined,

      rerenderLottie() {
        const { manager } = get();
        manager.rerenderLottie();
      },

      setLottie(lottie) {
        const { manager } = get();
        manager.loadNewLottie(lottie);
      },
      setConfig(update) {
        const { manager } = get();
        manager.updateConfig(update);
      },
      setExecutions(update) {
        const { manager } = get();
        manager.updateExecutions(update);
      },
      setCampaign(update) {
        const { manager } = get();
        manager.updateCampaign(update);
      },

      resetExecutions() {
        const { manager } = get();
        manager.resetExecutions();
      },

      blinkLayer(target: Layer) {
        const { manager } = get();
        manager.blinkLayer(target);
      },
      blinkShape(target: Shape) {
        const { manager } = get();
        manager.blinkShape(target);
      },
      blinkTargetList(targets: (Layer | Shape)[]) {
        const { manager } = get();
        manager.blinkTargetList(targets);
      },
    };
  };
