import {
  RefObject,
  createContext,
  useContext,
  useEffect,
  useState
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

//-------------------------------------------------------
export function useDragAndDropSource<T = any>(
  ref: RefObject<HTMLElement | undefined>,
  type: string,
  data: T | (() => T)
) {
  const startDrag = useDragAndDropStore((store) => store.start);
  const endDrag = useDragAndDropStore((store) => store.end);

  useEffect(() => {
    const source = ref.current;
    if (!source) {
      return;
    }

    source.draggable = true;
    source.ondragstart = () => {
      let dataToSend = data;
      if (typeof data === "function") {
        dataToSend = (data as () => T)();
      }
      startDrag(type, dataToSend);
    };
    source.ondragend = () => {
      endDrag();
    };
  }, [data, endDrag, ref, startDrag, type]);
}

export function useDragAndDropTarget<T = any>(
  ref: RefObject<HTMLElement | undefined>,
  options: {
    types?: string[];
    validate?: (type: string, data: T) => boolean;
    onDrop?: (type: string, data: T) => void;
  }
) {
  const { onDrop, types, validate } = options;
  const getDragAndDropState = useDragAndDropStore((store) => store.getState);
  const [isDragOver, setIsDragOver] = useState(false);
  const [canDrop, setCanDrop] = useState(false);

  useEffect(() => {
    const source = ref.current;
    if (!source) {
      return;
    }

    const verifyAcceptDrop = () => {
      const { data, isDragging, type } = getDragAndDropState();

      if (!isDragging) {
        return false;
      }

      if (types && !types.includes(type)) {
        return false;
      }

      if (validate) {
        return validate(type, data);
      }
      return true;
    };

    source.ondragover = (e: DragEvent) => {
      setIsDragOver(true);
      if (!verifyAcceptDrop()) {
        return;
      }
      setCanDrop(true);
      e.preventDefault();
    };

    source.ondragleave = (e: DragEvent) => {
      setIsDragOver(false);
      setCanDrop(false);
    };

    source.ondrop = (e: DragEvent) => {
      const { data, type } = getDragAndDropState();

      setIsDragOver(false);
      setCanDrop(false);

      if (!verifyAcceptDrop()) {
        return;
      }

      onDrop && onDrop(type, data);
    };
  }, [getDragAndDropState, onDrop, ref, types, validate]);

  return {
    isDragOver,
    canDrop,
  };
}

export default useDragAndDropStore;
