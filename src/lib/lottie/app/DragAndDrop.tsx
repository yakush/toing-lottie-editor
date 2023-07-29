import {
  createContext,
  useContext,
  useRef,
  useState,
  MutableRefObject,
  RefObject,
  useEffect,
} from "react";
import { StoreApi, create, createStore, useStore } from "zustand";
import {
  DragAndDropStore,
  DragAndDropStoreCreatorFactory,
} from "./DragAndDropStoreCreator";

const DragAndDropStoreContext = createContext<StoreApi<DragAndDropStore>>(
  create(DragAndDropStoreCreatorFactory("default"))
);

let counter = 0;

type DragAndDropStoreProviderProps = {
  children?: React.ReactNode;
  displayName?: string;
};

export const DragAndDropStoreProvider = ({
  displayName,
  children,
}: DragAndDropStoreProviderProps) => {
  const [store] = useState(() => {
    counter++;
    displayName = displayName ?? `drag and drop ${counter}`;
    return createStore(DragAndDropStoreCreatorFactory(displayName));
  });
  return (
    <DragAndDropStoreContext.Provider value={store}>
      {children}
    </DragAndDropStoreContext.Provider>
  );
};

export const useDragAndDropStore = <T,>(
  selector?: (state: DragAndDropStore) => T
): T => {
  const store = useContext(DragAndDropStoreContext);
  const slice = useStore(store, selector ?? ((state) => state as T));
  return slice;
};

export const useDragAndDropSource = (
  ref: RefObject<HTMLElement>,
  draggable: boolean,
  type: string
) => {
  const start = useDragAndDropStore((s) => s.start);
  const end = useDragAndDropStore((s) => s.end);

  useEffect(() => {
    const element = ref.current;
    if (element && draggable) {
      if (draggable) {
        element.draggable = draggable;
        element.ondragstart = () => {
          start(type, { element });
        };
        element.ondragend = () => {
          end();
        };
      }
    }
  }, [ref, draggable, start, end, type]);
};

export const useDragAndDropTarget = (
  ref: RefObject<HTMLElement>,
  enable: boolean,
  type: string
) => {
  const draggedType = useDragAndDropStore((s) => s.type);
  const data = useDragAndDropStore((s) => s.data);
  const isDragging = useDragAndDropStore((s) => s.isDragging);

  useEffect(() => {
    const element = ref.current;
    if (element && enable) {
      if (enable) {
        element.ondragover = (e) => {
          if (isDragging && draggedType === type) {
            e.preventDefault();
          }
        };
        element.ondrop = (e) => {
          console.log("dropped", { type, draggedType, data });
        };
      }
    }
  }, [draggedType, enable, isDragging, ref, type, data]);
};

export default useDragAndDropStore;
