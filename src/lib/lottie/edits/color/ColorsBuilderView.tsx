import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { IconButton } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { LottieColorRefHelper } from "../../core/LottieColorRefHelper";
import {
  colorSchemaSlotToName,
  colorSchemaSlots,
  getEmptyColorMapping,
} from "../../core/colorSchema";
import { EditBuilderProps } from "../../modules/builderUiModule";
import useDragAndDropStore, {
  useDragAndDropSource,
  useDragAndDropTarget,
} from "../../stores/DragAndDropStore";
import useToingStore from "../../stores/ToingStore";
import { ToingEditEndpoint } from "../../types";
import { combineClasses } from "../../utils/css";
import styles from "./ColorsBuilderView.module.css";
import { Config, Execution } from "./_ColorsExecuter";
import ColorBox from "./extra/ColorBox";

type Props = EditBuilderProps<Config, Execution>;

export default function ColorsBuilderView({ edit, onEditChanged }: Props) {
  // const lottie = useToingStore((store) => store.lottie);
  const { config } = edit;

  const [colorMapping, setColorMapping] = useState(getEmptyColorMapping());

  // config slots to mapping (order and fill blanks)
  useEffect(() => {
    const slots = config.slots ?? {};
    let newMapping = getEmptyColorMapping();

    for (const key in slots) {
      if (Object.prototype.hasOwnProperty.call(slots, key)) {
        const slot = key as colorSchemaSlots;
        let color = slots[slot];
        if (typeof color === "string") {
          color = [color];
        }
        newMapping[slot] = color;
      }
    }
    setColorMapping(newMapping);
  }, [config.slots]);

  const update = (newData: ToingEditEndpoint<Config, Execution>) => {
    if (!onEditChanged) {
      return;
    }
    onEditChanged(newData);
  };

  const onChangeMapping = (slot: colorSchemaSlots, colors?: string[]) => {
    const newEdit = structuredClone(edit);
    if (!newEdit.config.slots) {
      newEdit.config.slots = {};
    }

    //remove colors from other slots to avoid duplicates:
    if (colors) {
      for (const key in newEdit.config.slots) {
        if (Object.prototype.hasOwnProperty.call(newEdit.config.slots, key)) {
          const currentSlot = key as colorSchemaSlots;
          let currentColors = newEdit.config.slots[currentSlot];

          if (currentSlot === slot) {
            continue;
          }
          if (currentColors == null) {
            continue;
          }

          if (typeof currentColors === "string") {
            currentColors = [currentColors];
          }

          newEdit.config.slots[currentSlot] = currentColors.filter(
            (color: string) => !colors.includes(color)
          );
        }
      }
    }

    newEdit.config.slots[slot] = colors;
    update(newEdit);
  };

  const onThrowColor = (colorToThrow: string) => {
    const newEdit = structuredClone(edit);
    if (!newEdit.config.slots) {
      newEdit.config.slots = {};
    }

    //remove color
    if (colorToThrow) {
      for (const key in newEdit.config.slots) {
        if (Object.prototype.hasOwnProperty.call(newEdit.config.slots, key)) {
          const currentSlot = key as colorSchemaSlots;
          let currentColors = newEdit.config.slots[currentSlot];

          if (currentColors == null) {
            continue;
          }

          if (typeof currentColors === "string") {
            currentColors = [currentColors];
          }

          newEdit.config.slots[currentSlot] = currentColors.filter(
            (color: string) => color !== colorToThrow
          );
        }
      }
    }

    update(newEdit);
  };

  return (
    <div className={styles.root}>
      toing colors:
      <ColorGroups />
      <hr />
      schema:
      <div>
        {Object.entries(colorMapping).map(([key, colors], i) => (
          <ColorSlotTarget
            key={key}
            slot={key as colorSchemaSlots}
            colors={colors}
            onChange={(colors) =>
              onChangeMapping(key as colorSchemaSlots, colors)
            }
          />
        ))}
      </div>
      <div className={styles.colorsTrashContainer}>
        <ColorsTrash onThrowColor={onThrowColor} />
      </div>
    </div>
  );
}

function ColorGroups() {
  const lottie = useToingStore((store) => store.lottie);
  const groups = LottieColorRefHelper.getColorGroups(lottie);

  return (
    <div className={styles.ColorGroups}>
      {groups.map((group, i) => (
        <ColorItem key={i} color={group.colorHex} />
      ))}
    </div>
  );
}

type ColorDragData = {
  color: string;
  canTrash: boolean;
};
const colorDragTypeName = "color-group";

function ColorItem({
  color,
  canTrash = false,
}: {
  color: string;
  canTrash?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useDragAndDropSource<ColorDragData>(ref, colorDragTypeName, {
    color,
    canTrash,
  });

  return (
    <div ref={ref} className={styles.ColorGroupItem}>
      <ColorBox color={color} />
    </div>
  );
}

function ColorSlotTarget({
  slot,
  colors,
  onChange,
}: {
  slot: colorSchemaSlots;
  colors?: string[];
  onChange?: (colors?: string[]) => void;
}) {
  const lottie = useToingStore((store) => store.lottie);
  const ref = useRef<HTMLDivElement>(null);

  const groups = LottieColorRefHelper.getColorGroups(lottie);
  const name = colorSchemaSlotToName(slot);

  const selectedGroups = groups.filter((item) =>
    colors?.includes(item.colorHex)
  );
  const targetsCount = selectedGroups.reduce(
    (acc, group) => acc + group.refs.length,
    0
  );

  const hasColors = colors && colors.length !== 0;

  const { canDrop } = useDragAndDropTarget<ColorDragData>(ref, {
    types: [colorDragTypeName],
    // validate(type, data) {
    //   const addedColor = data;
    //   return colors ? !colors.includes(addedColor) : true;
    // },
    onDrop: (type, data) => {
      const addedColor = data.color;
      if (colors && colors.includes(addedColor)) {
        //color is already included!
        return;
      }

      const newColors = colors ? [...colors, addedColor] : [addedColor];
      onChange && onChange(newColors);
    },
  });
  return (
    <div
      ref={ref}
      className={combineClasses({
        [styles.ColorSlotTarget]: true,
        [styles.dragOver]: canDrop,
      })}
    >
      <div className={styles.name}>{name}</div>
      {hasColors && (
        <>
          {colors?.map((color) => (
            <ColorItem key={color} color={color} canTrash={true} />
          ))}
          {targetsCount} targets
        </>
      )}
      <div className={styles.space} />
      <IconButton
        disabled={!hasColors}
        aria-label="delete"
        onClick={() => onChange && onChange(undefined)}
      >
        {" "}
        <DeleteOutlineIcon />
      </IconButton>
    </div>
  );
}

function ColorsTrash({
  onThrowColor,
}: {
  onThrowColor?: (color: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const isDragging = useDragAndDropStore((store) => store.isDragging);
  const type = useDragAndDropStore((store) => store.type);
  const data = useDragAndDropStore((store) => store.data);

  const { canDrop, isDragOver } = useDragAndDropTarget<ColorDragData>(ref, {
    validate: (type, data) => {
      return data.canTrash;
    },

    onDrop: (type, data) => {
      onThrowColor && onThrowColor(data.color);
    },
  });

  const show =
    isDragging &&
    type === colorDragTypeName &&
    (data as ColorDragData).canTrash;

  return (
    <div
      ref={ref}
      className={combineClasses({
        [styles.ColorsTrash]: true,
        [styles.disabled]: !show,
        [styles.dragOver]: isDragOver && canDrop,
      })}
    >
      <DeleteOutlineIcon />
    </div>
  );
}
