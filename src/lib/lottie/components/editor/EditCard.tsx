import React, { ReactNode } from "react";
import styles from "./EditCard.module.css";
import EditCardHeader from "./EditCardHeader";
import Button from "../ui/Button";

type Props = {
  onReset?: () => void;
  children?: React.ReactNode;
};

export default function EditCard({ onReset, children }: Props) {
  let header: ReactNode;
  let content: ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }

    if (child.type === EditCardHeader) {
      header = child;
    } else {
      content.push(child);
    }
  });

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.cardHeaderContent}> {header} </div>
        <Button className={styles.reset} onClick={() => onReset && onReset()}>
          reset
        </Button>
      </div>
      <div className={styles.content}>{content}</div>
    </div>
  );
}
