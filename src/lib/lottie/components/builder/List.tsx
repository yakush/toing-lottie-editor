import EventEmitter from "events";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { combineClasses } from "../../utils/css";
import styles from "./List.module.css";
import ListHeader from "./ListHeader";

//-------------------------------------------------------
// List wrapper context:
interface ListStore {
  events: EventEmitter;
  actions: {
    openAll: () => void;
    closeAll: () => void;
  };
}

export const ListStoreEvents = {
  openAll: "openAll",
  closeAll: "closeAll",
} as const;

const ListContext = createContext<ListStore | undefined>(undefined);

const ListProvider = ({ children }: { children: ReactNode }) => {
  const [store, setStore] = useState<ListStore>();

  useEffect(() => {
    const events = new EventEmitter();
    events.setMaxListeners(1000);

    const actions = {
      openAll() {
        events.emit(ListStoreEvents.openAll);
      },
      closeAll() {
        events.emit(ListStoreEvents.closeAll);
      },
    };
    setStore({ events, actions });
  }, []);

  return <ListContext.Provider value={store}>{children}</ListContext.Provider>;
};

export const useListStore = () => useContext(ListContext);

/** wrapper for components. puts a listStore around the component */
export const withListStore =
  <P extends Props>(Component: React.ComponentType<P>) =>
  (props: P) => {
    const listContext = useContext(ListContext);

    if (listContext) {
      return <Component {...props} />;
    }

    return (
      <ListProvider>
        <Component {...props} />
      </ListProvider>
    );
  };
//-------------------------------------------------------

type Props = {
  children?: React.ReactNode;
  lineColor?: string;
};
const List = ({ children, lineColor }: Props) => {
  const listStore = useListStore();

  const [open, setOpen] = useState(true);

  let header: ReactNode;
  let content: ReactNode[] = [];

  useEffect(() => {
    if (listStore) {
      const openAllHandler = () => setOpen(true);
      const closeAllHandler = () => setOpen(false);

      listStore.events.on(ListStoreEvents.openAll, openAllHandler);
      listStore.events.on(ListStoreEvents.closeAll, closeAllHandler);

      //dispose:
      return () => {
        listStore.events.off(ListStoreEvents.openAll, openAllHandler);
        listStore.events.off(ListStoreEvents.closeAll, closeAllHandler);
      };
    }
  }, [listStore]);

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }

    if (child.type === ListHeader) {
      header = child;
    } else {
      content.push(child);
    }
  });

  const hasChildren = content.length > 0;

  const toggleOpen = () => setOpen((x) => !x);

  if (!hasChildren) {
    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <div
            className={combineClasses(styles.headerIcon, {
              [styles.hasChildren]: hasChildren,
            })}
            onClick={toggleOpen}
          ></div>
          <div>{header}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div
          className={combineClasses(styles.headerIcon, {
            [styles.hasChildren]: hasChildren,
          })}
          onClick={toggleOpen}
        >
          {open ? "-" : "+"}
        </div>
        <div>{header}</div>
      </div>

      <div
        className={combineClasses(styles.listWrap, { [styles.closed]: !open })}
      >
        <div
          className={styles.shapeListSideLine}
          style={{ borderColor: lineColor }}
        />
        <div className={styles.content}>{content}</div>
      </div>
    </div>
  );
};

export default List;
