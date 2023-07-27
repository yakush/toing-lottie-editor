import { createContext, useContext, useState } from "react";
import { StoreApi, create, createStore, useStore } from "zustand";
import { LottieStore, LottieStoreCreatorFactory } from "./LottieStoreCreator";

const LottieStoreContext = createContext<StoreApi<LottieStore>>(
  create(LottieStoreCreatorFactory("default lottie store"))
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
    return createStore(LottieStoreCreatorFactory(displayName));
  });
  return (
    <LottieStoreContext.Provider value={store}>
      {children}
    </LottieStoreContext.Provider>
  );
};

export const useLottieStore = <T,>(selector?: (state: LottieStore) => T): T => {
  const store = useContext(LottieStoreContext);
  const slice = useStore(
    store,
    selector ?? ((state: LottieStore) => state as T)
  );
  return slice;
};

//-------------------------------------------------------
//export const useLottieStore = create(LottieStoreCreator);

//-------------------------------------------------------
export default useLottieStore;
