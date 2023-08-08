import { createContext, useContext, useState } from "react";
import { StoreApi, create, createStore, useStore } from "zustand";
import { ToingStore, ToingStoreCreatorFactory } from "./ToingStoreCreator";

const ToingStoreContext = createContext<StoreApi<ToingStore>>(
  create(ToingStoreCreatorFactory("default toing store"))
);

let counter = 0;

type LottieStoreProviderProps = {
  children?: React.ReactNode;
  displayName?: string;
};

export const LottieStoreProvider = ({
  displayName,
  children,
}: LottieStoreProviderProps) => {
  const [store] = useState(() => {
    counter++;
    displayName = displayName ?? `lottie store ${counter}`;
    return createStore(ToingStoreCreatorFactory(displayName));
  });
  return (
    <ToingStoreContext.Provider value={store}>
      {children}
    </ToingStoreContext.Provider>
  );
};

export const useToingStore = <T,>(selector?: (state: ToingStore) => T): T => {
  const store = useContext(ToingStoreContext);
  const slice = useStore(
    store,
    selector ?? ((state: ToingStore) => state as T)
  );
  return slice;
};

//-------------------------------------------------------
//export const useToingStore = create(LottieStoreCreator);

//-------------------------------------------------------
export default useToingStore;
