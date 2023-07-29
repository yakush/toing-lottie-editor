import React, { ReactNode } from "react";
import styles from "./BuilderCard.module.css";
import BuilderCardHeader from "./BuilderCardHeader";

type Props = {
  children?: React.ReactNode;
};

export default function BuilderCard({ children }: Props) {
  let header: ReactNode;
  let content: ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }

    if (child.type === BuilderCardHeader) {
      header = child;
    } else {
      content.push(child);
    }
  });

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.cardHeaderContent}> {header} </div>
      </div>
      <div className={styles.content}>{content}</div>
    </div>
  );
}
