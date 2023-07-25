import { DragEvent, useState } from "react";
import styles from "./FileDropTarget.module.css";
import { combineClasses } from "../utils/css";

type Props = {
  onDrop?: (files: FileList) => void;
};

export default function FileDropTarget({ onDrop }: Props) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const { files } = e.dataTransfer;

    if (files && files.length) {
      onDrop && onDrop(files);
    }
  };

  return (
    <div
      className={combineClasses(styles, ["area", isDragging && "dragging"])}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      Hey, drop me some files
    </div>
  );
}
