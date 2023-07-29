import { DragEvent, useMemo, useState } from "react";
import { useLottieStore } from "../../app";
import useDragAndDropStore from "../../app/DragAndDrop";
import icon_target from "../../assets/icon_target.svg";
import { Layer, LottieRef, Shape, layerTypes, shapeTypes } from "../../core";
import { combineClasses } from "../../utils/css";
import {
  findLayerRef,
  findLottieRef,
  findShapeRef,
} from "../../utils/lottieUtils";
import styles from "./RefListSelector.module.css";
type Props = {
  values?: LottieRef[];
  onChange?: (refs: LottieRef[]) => void;
  onVerify?: (type: string, data?: any) => boolean;

  disabled?: boolean;
  disableLayer?: boolean;
  disableShape?: boolean;
  allowLayerTypes?: layerTypes[];
  allowShapeTypes?: shapeTypes[];
};

export default function RefListSelector({
  values,
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

  const [targetRefs, _setTargetRefs] = useState<LottieRef[]>(values ?? []);
  const [isDragOver, setIsDragOver] = useState(false);
  const [canDrop, setCanDrop] = useState(false);

  const targets = useMemo(() => {
    const targets =
      lottie && targetRefs.map((ref) => findLottieRef(lottie, ref));
    return targets;
  }, [lottie, targetRefs]);

  const addRef = (ref: LottieRef) => {
    _setTargetRefs((old) => {
      if (old.includes(ref)) {
        return old;
      }

      const v = [ref, ...old];
      onChange && onChange(v);
      return v;
    });
  };

  const removeRef = (ref: LottieRef) => {
    _setTargetRefs((old) => {
      const v = old.filter((item) => item !== ref);
      onChange && onChange(v);
      return v;
    });
  };

  const clearRefs = () => {
    _setTargetRefs((old) => {
      const v: LottieRef[] = [];
      onChange && onChange(v);
      return v;
    });
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
    addRef(data);
  };

  const onClickDelete = (ref: LottieRef) => {
    removeRef(ref);
  };

  const onClickClear = () => {
    clearRefs();
  };

  const blinkAll = () => {
    let realTargets: (Shape | Layer)[] = [];

    targets?.forEach((element) => {
      if (element) {
        realTargets.push(element);
      }
    });

    blinkTargetList(realTargets);
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
      <div className={styles.header}>
        <div className={styles.title} onClick={() => blinkAll()}>
          Targets{" "}
          {!!targetRefs.length &&
            (targetRefs.length === 1
              ? `(1 item)`
              : `(${targetRefs.length} items)`)}
        </div>
        <div className={styles.ui}>
          <button onClick={() => clearRefs()}>clear</button>
        </div>
      </div>
      <div className={styles.list}>
        {targetRefs.map((ref, i) => (
          <div key={JSON.stringify(ref)}>
            <Item
              value={ref}
              target={targets?.at(i)}
              onDelete={(ref) => removeRef(ref)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

//-------------------------------------------------------
//-------------------------------------------------------

type ItemProps = {
  value: LottieRef;
  target?: Layer | Shape;
  onDelete?: (ref: LottieRef) => void;
};

function Item({ value, target, onDelete }: ItemProps) {
  const blinkTargetList = useLottieStore((store) => store.blinkTargetList);

  return (
    <div
      className={styles.item}
      onClick={() => target && blinkTargetList([target])}
    >
      <div className={styles.body}>
        <img className={styles.icon} src={icon_target} alt="icon_target" />
        <div className={styles.details}>ref {target?.nm}</div>
      </div>
      <div className={styles.ui}>
        <button onClick={() => onDelete && onDelete(value)}>x</button>
      </div>
    </div>
  );
}
