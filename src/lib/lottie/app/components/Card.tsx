import React, { ReactNode, useState } from "react";
import styles from "./Card.module.css";
import { combineClasses } from "../../utils/css";
import CardHeader from "./CardHeader";

type Props = {
  children?: React.ReactNode;
};

export default function Card({ children }: Props) {
  const [open, setOpen] = useState(true);

  let header: ReactNode;
  let content: ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }

    if (child.type === CardHeader) {
      header = child;
    } else {
      content.push(child);
    }
  });
  return (
    <div className={combineClasses(styles.root, { [styles.closed]: !open })}>
      <div className={styles.header} onClick={() => setOpen((x) => !x)}>
        <span className={styles.toggle}>{open ? "-" : "+"}</span>
        {header}
      </div>
      <div className={styles.content}>{content}</div>
    </div>
  );
}
