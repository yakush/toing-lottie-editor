import React, { ReactNode } from "react";
import styles from "./EditCard.module.css";

type Props = {
  children?: React.ReactNode;
};

export default function EditCardHeader({ children }: Props) {
  return <div>{children} </div>;
}
