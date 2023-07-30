import React, { Children, MouseEvent } from "react";
import styles from "./PopOver.module.css";

type Props = {
  show: boolean;
  onClosed: () => void;
  children?: React.ReactNode;
};

export default function PopOver({ show, onClosed, children }: Props) {
  const onBackgroundClick = (e: MouseEvent) => {
    e.stopPropagation();
    // e.preventDefault();
    onClosed();
  };

  const onContentClick = (e: MouseEvent) => {
    e.stopPropagation();
    // e.preventDefault();
    //onClosed();
  };
  if (!show) {
    return <></>;
  }

  return (
    <div className={styles.root} onClick={onBackgroundClick}>
      <div className={styles.children} onClick={onContentClick}>
        {children}
      </div>
    </div>
  );
}
