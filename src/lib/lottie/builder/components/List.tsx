import React, { ReactNode, useState } from "react";
import ListHeader from "./ListHeader";
import styles from "./List.module.css";
import { combineClasses } from "../../utils/css";

//-------------------------------------------------------

type Props = {
  children?: React.ReactNode;
  lineColor?: string;
};

export default function List({ children, lineColor }: Props) {
  const [open, setOpen] = useState(true);

  let header: ReactNode;
  let content: ReactNode[] = [];

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
}
