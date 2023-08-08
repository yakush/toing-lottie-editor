import React, { ReactNode, useState } from "react";
import styles from "./Card.module.css";
import { combineClasses } from "../../utils/css";
import CardHeader from "./CardHeader";
import CardFooter from "./CardFooter";

type Props = {
  children?: React.ReactNode;
  collapsed?: boolean;
  smallestHeight?: boolean;
};

export default function Card({ children, collapsed, smallestHeight }: Props) {
  const [open, setOpen] = useState(collapsed !== null ? !collapsed : true);

  let header: ReactNode;
  let footer: ReactNode;
  let content: ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }

    if (child.type === CardHeader) {
      header = child;
    } else if (child.type === CardFooter) {
      footer = child;
    } else {
      content.push(child);
    }
  });
  return (
    <div
      className={combineClasses({
        [styles.root]: true,
        [styles.closed]: !open,
        [styles.smallestHeight]: !!smallestHeight,
      })}
    >
      <div className={styles.header} onClick={() => setOpen((x) => !x)}>
        <span className={styles.toggle}>{open ? "-" : "+"}</span>
        {header}
      </div>
      <div className={styles.content}>{content}</div>
      {footer && <div className={styles.footer}> {footer} </div>}
    </div>
  );
}
