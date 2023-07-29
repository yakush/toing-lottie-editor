import { DragEvent, useMemo, useState } from "react";
import { useLottieStore } from "../../app";
import useDragAndDropStore from "../../app/DragAndDrop";
import icon_target from "../../assets/icon_target.svg";
import { LottieRef, layerTypes, shapeTypes } from "../../core";
import { combineClasses } from "../../utils/css";
import {
  findLayerRef,
  findLottieRef,
  findShapeRef,
} from "../../utils/lottieUtils";
import styles from "./RefSelector.module.css";

type Props = {
  value?: LottieRef;
  onChange?: (ref?: LottieRef) => void;
  onVerify?: (type: string, data?: any) => boolean;

  disabled?: boolean;
  disableLayer?: boolean;
  disableShape?: boolean;
  allowLayerTypes?: layerTypes[];
  allowShapeTypes?: shapeTypes[];
};

export default function RefSelector({
  value,
  onChange,
  onVerify,
  disabled,
  disableLayer,
  disableShape,
  allowLayerTypes,
  allowShapeTypes,
}: Props) {
  const lottie = useLottieStore((store) => store.lottie);
  const blinkTargetList = useLottieStore((store) => store.blinkTargetList);

  const getDragAndDropState = useDragAndDropStore((store) => store.getState);

  const [targetRef, _setTargetRef] = useState<LottieRef | undefined>(value);
  const [isDragOver, setIsDragOver] = useState(false);
  const [canDrop, setCanDrop] = useState(false);

  const target = useMemo(() => {
    const target = lottie && findLottieRef(lottie, targetRef);
    return target;
  }, [lottie, targetRef]);

  const updateRef = (value?: LottieRef) => {
    if (value === targetRef) {
      return;
    }
    _setTargetRef(value);
    onChange && onChange(value);
  };

  const verifyAcceptDrop = () => {
    const { data, isDragging, type } = getDragAndDropState();

    if (disabled) {
      return false;
    }

    if (!isDragging) {
      return false;
    }

    if (type !== "layer" && type !== "shape") {
      return false;
    }

    if (type === "layer" && disableLayer) {
      return false;
    }

    if (type === "shape" && disableShape) {
      return false;
    }

    // allowLayerTypes
    if (data && type === "layer" && allowLayerTypes?.length) {
      const target = findLayerRef(lottie, data);
      if (target) {
        if (!allowLayerTypes.includes(target?.ty)) {
          return false;
        }
      }
    }

    // allowShapeTypes
    if (data && type === "shape" && allowShapeTypes?.length) {
      const target = findShapeRef(lottie, data);
      if (target) {
        if (!allowShapeTypes.includes(target?.ty)) {
          return false;
        }
      }
    }

    if (onVerify) {
      return onVerify(type, data);
    }
    return true;
  };

  const onDragOver = (e: DragEvent) => {
    setIsDragOver(true);
    if (!verifyAcceptDrop()) {
      return;
    }
    setCanDrop(true);
    e.preventDefault();
  };
  const onDragLeave = (e: DragEvent) => {
    setIsDragOver(false);
    setCanDrop(false);
  };

  const onDrop = (e: DragEvent) => {
    const { data } = getDragAndDropState();

    setIsDragOver(false);
    setCanDrop(false);

    if (!verifyAcceptDrop()) {
      return;
    }
    updateRef(data);
  };

  const onClickDelete = () => {
    updateRef(undefined);
  };

  return (
    <div
      className={combineClasses({
        [styles.root]: true,
        [styles.canDrop]: canDrop,
        [styles.isDragOver]: isDragOver,
      })}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
    >
      <div
        className={combineClasses(styles.target, {
          [styles.hasRef]: !!targetRef,
        })}
      >
        <div
          className={styles.targetRef}
          onClick={() => target && blinkTargetList([target])}
        >
          <img className={styles.icon} src={icon_target} alt="" />
          <div className={styles.text}>
            {target && (target?.nm || "has target")}
          </div>
        </div>
        <button
          className={styles.delete}
          onClick={onClickDelete}
          disabled={!targetRef}
        >
          X
        </button>
      </div>
    </div>
  );
}
