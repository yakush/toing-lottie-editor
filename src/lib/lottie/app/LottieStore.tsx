import { create } from "zustand";
import {
  EditData,
  Lottie,
  LottieLoader,
  LottieManager,
  LottieManagerEvents,
} from "../core";

export interface LottieState {
  manager: LottieManager;
  loader: LottieLoader;
  lottie?: Lottie;
  edits?: EditData[];
  isLoading: boolean;
  errorLoading?: string;

  loadUrl: (lottieUrl: string, editsUrl?: string) => Promise<void>;
  loadFile: (lottieFile: File, editsFile?: File) => Promise<void>;

  setEdits: (edits: EditData[]) => void;
  resetExecutions: () => void;
}

//-------------------------------------------------------

export const useLottieStore = create<LottieState>((set, get) => {
  const manager = new LottieManager();
  const loader = new LottieLoader();

  //events
  manager.on(LottieManagerEvents.onChangeLottie, (lottie) => set({ lottie }));
  manager.on(LottieManagerEvents.onChangeEdits, (edits) => set({ edits }));

  //TODO: when do i unsubscribe store events?

  const startLoading = () => {
    set({
      isLoading: true,
      errorLoading: undefined,
      edits: undefined,
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

  //store
  return {
    manager,
    loader,
    lottie: undefined,
    isLoading: false,
    errorLoading: undefined,

    async loadUrl(lottieUrl, editsUrl) {
      const { loader, manager } = get();
      try {
        startLoading();
        const res = await loader.loadUrl(lottieUrl, editsUrl);
        finishLoading();
        manager.loadNewLottie(res.lottie, res.edits);
      } catch (err: any) {
        finishLoading(err);
        manager.loadNewLottie();
      }
    },

    async loadFile(lottieFile: File, editsFile?: File) {
      const { loader, manager } = get();
      try {
        startLoading();
        const res = await loader.loadFile(lottieFile, editsFile);
        finishLoading();
        manager.loadNewLottie(res.lottie, res.edits);
      } catch (err: any) {
        finishLoading(err);
        manager.loadNewLottie();
      }
    },

    setEdits(edits) {
      const { manager } = get();
      manager.updateEdits(edits);
    },

    resetExecutions() {
      const { manager } = get();
      manager.resetDefaults();
    },
  };
});

export default useLottieStore;
