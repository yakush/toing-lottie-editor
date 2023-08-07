import { StateCreator } from "zustand";
import {
  Layer,
  Lottie,
  ToingConfig,
  LottieLoader,
  LottieManager,
  LottieManagerEvents,
  Shape,
  updater,
  ToingUserExecutions,
  ToingCampaign,
} from "../core";

export interface LottieStore {
  displayName: string;
  manager: LottieManager;
  lottie?: Lottie;
  origLottie?: Lottie;
  config?: ToingConfig;
  userExecutions?: ToingUserExecutions;
  campaign?: ToingCampaign;

  isLoading: boolean;
  errorLoading?: string;

  loadUrl: (lottieUrl: string) => Promise<void>;
  loadFile: (lottieFile: File) => Promise<void>;

  rerenderLottie: () => void;

  setConfig: (update: updater<ToingConfig>) => void;
  setExecutions: (update: updater<ToingUserExecutions>) => void;
  setCampaign: (update: updater<ToingUserExecutions>) => void;

  resetExecutions: () => void;

  blinkLayer: (target: Layer) => void;
  blinkShape: (target: Shape) => void;
  blinkTargetList: (target: (Layer | Shape)[]) => void;
}

export const LottieStoreCreatorFactory: (
  displayName?: string
) => StateCreator<LottieStore> =
  (displayName: string = "lottie store") =>
  (set, get, a) => {
    const manager = new LottieManager();

    //events
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

    //TODO: when do i unsubscribe store events?

    // HELPERS
    const startLoading = () => {
      set({
        isLoading: true,
        errorLoading: undefined,
        lottie: undefined,
      });
    };

    const finishLoading = (err?: any) => {
      //error
      if (err) {
        console.warn("error loading lottie", err);
        set({
          isLoading: false,
          errorLoading: `error loading lottie, ${err.toString()}`,
        });
        return;
      }
      //success
      set({
        isLoading: false,
        errorLoading: undefined,
      });
    };

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

      async loadUrl(lottieUrl) {
        const { manager } = get();
        const loader = new LottieLoader<Lottie>();
        try {
          startLoading();
          const res = await loader.loadUrl(lottieUrl);
          finishLoading();
          manager.loadNewLottie(res);
        } catch (err: any) {
          finishLoading(err);
          manager.loadNewLottie();
        }
      },

      async loadFile(lottieFile: File, editsFile?: File) {
        const { manager } = get();
        const loader = new LottieLoader<Lottie>();
        try {
          startLoading();
          const res = await loader.loadFile(lottieFile);
          finishLoading();
          manager.loadNewLottie(res);
        } catch (err: any) {
          finishLoading(err);
          manager.loadNewLottie();
        }
      },

      rerenderLottie() {
        const { manager } = get();
        manager.rerenderLottie();
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
        manager.resetDefaults();
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
