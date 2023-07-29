import { StateCreator } from "zustand";

export interface DragAndDropStore {
  displayName: string;
  readonly isDragging: boolean;
  readonly type: string;
  readonly data: any;
  start(type: string, data: any): void;
  end(): void;
  getState: () => {
    readonly isDragging: boolean;
    readonly type: string;
    readonly data: any;
  };
}

export const DragAndDropStoreCreatorFactory: (
  displayName?: string
) => StateCreator<DragAndDropStore> =
  (displayName: string = "drag and drop store") =>
  (set, get) => {
    let isDragging = false;
    let type = "";
    let data: any = undefined;

    return {
      displayName,
      isDragging,
      type,
      data,

      start(type, data) {
        set({ isDragging: true, type, data });
      },
      end() {
        set({ isDragging: false, type: "", data: undefined });
      },
      getState() {
        const { isDragging, type, data } = get();
        return {
          isDragging,
          type,
          data,
        };
      },
    };
  };
