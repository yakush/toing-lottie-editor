import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { IconButton } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { LottieColorRefHelper } from "../../core/LottieColorRefHelper";
import {
    colorSchemaSlotToName,
    colorSchemaSlots,
    getEmptyColorsPalette,
} from "../../core/colorSchema";
import { EditBuilderProps } from "../../modules/builderUiModule";
import {
    useDragAndDropSource,
    useDragAndDropTarget,
} from "../../stores/DragAndDropStore";
import useToingStore from "../../stores/ToingStore";
import { LottieColorRefGroup, ToingEditEndpoint } from "../../types";
import { combineClasses } from "../../utils/css";
import styles from "./ColorsBuilderView.module.css";
import { Config, Execution } from "./ColorsExecuter";
import ColorBox from "./extra/ColorBox";

type Props = EditBuilderProps<Config, Execution>;

export default function ColorsBuilderView({ edit, onEditChanged }: Props) {
  const lottie = useToingStore((store) => store.lottie);
  const { config } = edit;

  const [groups, setGroups] = useState(getEmptyColorsPalette());

  useEffect(() => {
    const slots = config.slots ?? {};
    let newGroups = { ...getEmptyColorsPalette() };

    for (const key in slots) {
      if (Object.prototype.hasOwnProperty.call(slots, key)) {
        const slot = key as colorSchemaSlots;
        const color = slots[key as colorSchemaSlots];
        newGroups[slot] = color;
      }
    }
    setGroups(newGroups);
  }, [config.slots, lottie]);

  const update = (newData: ToingEditEndpoint<Config, Execution>) => {
    if (!onEditChanged) {
      return;
    }
    onEditChanged(newData);
  };

  const onChangeGroup = (slot: colorSchemaSlots, color?: string) => {
    const newEdit = structuredClone(edit);
    if (!newEdit.config.slots) {
      newEdit.config.slots = {};
    }
    newEdit.config.slots[slot] = color;
    update(newEdit);
  };

  return (
    <div className={styles.root}>
      toing colors:
      <ColorGroups />
      <hr />
      schema:
      <div>
        {Object.entries(groups).map(([key, color], i) => (
          <ColorSlotTarget
            key={key}
            slot={key as colorSchemaSlots}
            color={color}
            onChange={(color) => onChangeGroup(key as colorSchemaSlots, color)}
          />
        ))}
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
        <ColorGroupItem key={i} group={group} />
      ))}
    </div>
  );
}

function ColorGroupItem({ group }: { group: LottieColorRefGroup }) {
  const ref = useRef<HTMLDivElement>(null);
  useDragAndDropSource<LottieColorRefGroup>(ref, "color-group", group);

  return (
    <div ref={ref} className={styles.ColorGroupItem}>
      <ColorBox color={group.colorHex} />
    </div>
  );
}

function ColorSlotTarget({
  slot,
  color,
  onChange,
}: {
  slot: colorSchemaSlots;
  color?: string;
  onChange?: (color?: string) => void;
}) {
  const lottie = useToingStore((store) => store.lottie);
  const ref = useRef<HTMLDivElement>(null);

  const groups = LottieColorRefHelper.getColorGroups(lottie);
  const name = colorSchemaSlotToName(slot);
  const group = groups.find((item) => item.colorHex === color);

  const { canDrop } = useDragAndDropTarget<LottieColorRefGroup>(ref, {
    types: ["color-group"],
    onDrop: (type, data) => {
      onChange && onChange(data.colorHex);
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
      {color && (
        <>
          {" "}
          <ColorBox color={color} small />
          {color} ({group && `${group.refs.length} targets`})
        </>
      )}
      <div className={styles.space} />
      <IconButton
        disabled={group == null}
        aria-label="delete"
        onClick={() => onChange && onChange(undefined)}
      >
        {" "}
        <DeleteOutlineIcon />
      </IconButton>
    </div>
  );
}
