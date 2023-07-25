import { create } from "zustand";
import { EditData, Lottie, LottieLoader, LottieManager } from "../core";

export interface LottieState {
  manager: LottieManager;
  loader: LottieLoader;
  lottie?: Lottie;
  edits?: EditData[];

  loadUrl: (lottieUrl: string, editsUrl?: string) => Promise<void>;
  loadFile: (lottieFile: File, editsFile?: File) => Promise<void>;

  setEdits: (edits: EditData[]) => void;
  resetExecutions: () => void;
}

export const lottieStore = create<LottieState>((set, get) => ({
  manager: new LottieManager(),
  loader: new LottieLoader(),
  lottie: undefined,

  async loadUrl(lottieUrl, editsUrl) {
    const { loader, manager } = get();
    const res = await loader.loadUrl(lottieUrl, editsUrl);
    manager.loadNewLottie(res.lottie, res.edits);
    set({ lottie: manager.lottie, edits: manager.edits });
  },

  async loadFile(lottieFile: File, editsFile?: File) {
    const { loader, manager } = get();
    const res = await loader.loadFile(lottieFile, editsFile);
    manager.loadNewLottie(res.lottie, res.edits);
    set({ lottie: manager.lottie, edits: manager.edits });
  },

  setEdits(edits) {
    const { manager } = get();
    manager.updateEdits(edits);
    set({ edits: manager.edits, lottie: manager.lottie });
  },

  resetExecutions() {
    const { manager } = get();
    manager.resetDefaults();

    set({ edits: manager.edits, lottie: manager.lottie });
  },
}));

export default lottieStore;
