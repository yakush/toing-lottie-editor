import React from "react";
import styles from "./LottieTree.module.css";
import { useStore } from "zustand";
import { useLottieStore } from "../../app";
import LottieLayer from "./lottieLayer";

type Props = {};

export default function LottieTree({}: Props) {
  const lottie = useLottieStore((state) => state.lottie);

  if (!lottie) {
    return <>no tree</>;
  }

  return (
    <div className={styles.root}>
      {lottie.layers?.map((layer) => (
        <LottieLayer layer={layer} key={layer.ind} />
      ))}
    </div>
  );
}
