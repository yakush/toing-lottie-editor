import { createContext, useContext, useState } from "react";
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

export default useDragAndDropStore;
