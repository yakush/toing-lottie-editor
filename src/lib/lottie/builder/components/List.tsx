import React, { ReactNode, useState } from "react";
import ListHeader from "./ListHeader";
import styles from "./List.module.css";

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
    return <div className={styles.header}>{header}</div>;
  }

  return (
    <div className={styles.root}>
      <div onClick={toggleOpen} className={styles.header}>
        <div className={styles.headerIcon}>{open ? "-" : "+"} </div>
        <div>{header}</div>
      </div>

      <div className={styles.listWrap}>
        <div
          className={styles.shapeListSideLine}
          style={{ borderColor: lineColor }}
        />
        <div>
          {open && hasChildren && (
            <div className={styles.content}>{content}</div>
          )}
        </div>
      </div>
    </div>
  );
}
