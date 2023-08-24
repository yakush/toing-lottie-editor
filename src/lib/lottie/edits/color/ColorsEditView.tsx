import { useId, useState } from "react";
import { LottieColorHelper } from "../../core/LottieColorHelper";
import {
  PaletteOption,
  colorSchemaSlotToName,
  colorSchemaSlots,
  getEmptyColorsPalette,
} from "../../core/colorSchema";
import { EditProps } from "../../modules/editorUiModule";
import useToingStore from "../../stores/ToingStore";
import styles from "./ColorsEditView.module.css";
import { ColorPaletteSource, Config, Execution } from "./ColorsExecuter";
import { defaultColorsPaletteOption } from "./defaultColors";
import ColorBox from "./extra/ColorBox";
import { IconButton } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { combineClasses } from "../../utils/css";
import { ChromePicker, ColorResult } from "react-color";

type Props = EditProps<Config, Execution>;

export default function ColorsEditView({
  editEndpoint,
  execution,
  onChange,
}: Props) {
  const id = useId();

  const { config } = editEndpoint;
  const campaign = useToingStore((store) => store.campaign);

  //get colors / default if no campaign
  let campaignPalette = campaign?.colors && campaign.colors[0];
  if (!campaignPalette || !campaignPalette.colors) {
    campaignPalette = defaultColorsPaletteOption;
  }

  const source = execution.paletteSource;

  const onChangeColor = (slot: colorSchemaSlots, color: string | undefined) => {
    const newExecution = { ...execution };
    newExecution.userDefinedColors = {
      ...getEmptyColorsPalette(),
      ...newExecution.userDefinedColors,
    };
    newExecution.userDefinedColors[slot] = color;

    onChange && onChange(newExecution);
  };

  const onChangeSelection = (newSelection: ColorPaletteSource) => {
    const newExecution = { ...execution };
    newExecution.paletteSource = newSelection;
    onChange && onChange(newExecution);
  };

  return (
    <div className={styles.root}>
      {/* <pre> {JSON.stringify(execution, null, 2)}</pre> */}
      {/* <pre> {JSON.stringify(campaign, null, 2)}</pre> */}

      {/* ------------------------------------------------------- */}
      {/* ORIGINAL */}
      <div className={styles.option}>
        <input
          type="radio"
          name=""
          id={`${id}-original`}
          value="original"
          checked={source === "original"}
          onChange={(e) =>
            onChangeSelection(e.target.value as ColorPaletteSource)
          }
        />
        <label htmlFor={`${id}-original`}>original</label>
      </div>

      {/* ------------------------------------------------------- */}
      {/* CAMPAIGN */}
      <div className={styles.option}>
        <input
          type="radio"
          name=""
          id={`${id}-campaign`}
          value="campaign"
          checked={source === "campaign"}
          onChange={(e) =>
            onChangeSelection(e.target.value as ColorPaletteSource)
          }
        />
        <label htmlFor={`${id}-campaign`}>
          campaign
          <ColorPalette palette={campaignPalette} />
          {campaignPalette.name && <span>({campaignPalette.name})</span>}
        </label>
      </div>

      {/* ------------------------------------------------------- */}
      {/* USER SELECTED */}
      <div className={styles.option}>
        <input
          type="radio"
          name=""
          id={`${id}-user`}
          value="user"
          checked={source === "user"}
          onChange={(e) =>
            onChangeSelection(e.target.value as ColorPaletteSource)
          }
        />
        <label htmlFor={`${id}-user`}>user defined</label>
      </div>

      {source === "user" && config.slots && (
        <UserColors
          config={config}
          execution={execution}
          onChangeColor={onChangeColor}
        />
      )}
    </div>
  );
}

//-------------------------------------------------------

function ColorSlot({
  slot,
  userColor,
  onChange,
  selected,
}: {
  slot: colorSchemaSlots;
  userColor?: string;
  onChange?: (color: string) => void;
  selected?: boolean;
}) {
  const changeColor = () => {
    const radomColorArr = [Math.random(), Math.random(), Math.random()];
    const radomColorHex = LottieColorHelper.rgbToHex(radomColorArr);
    onChange && onChange(radomColorHex);
  };

  return (
    <div
      className={combineClasses({
        [styles.ColorSlot]: true,
        [styles.selected]: !!selected,
      })}
      onClick={changeColor}
    >
      <ColorBox color={userColor} size="small" />
      <div>{colorSchemaSlotToName(slot)}</div>
    </div>
  );
}

//-------------------------------------------------------
function ColorPalette({ palette }: { palette: PaletteOption }) {
  return (
    <div className={styles.Palette}>
      {Object.entries(palette.colors).map(([key, item]) => (
        <div
          className={styles.PaletteItem}
          key={key}
          color={item}
          style={{ backgroundColor: item }}
        />
      ))}
    </div>
  );
}

//-------------------------------------------------------
function UserColors({
  config,
  execution,
  onChangeColor,
}: {
  config: Config;
  execution: Execution;
  onChangeColor?: (slot: colorSchemaSlots, color: string | undefined) => void;
}) {
  // digest config slots to array
  let availableSlots: { slot: colorSchemaSlots; colors: string[] }[] = [];
  for (const key in config.slots) {
    if (Object.prototype.hasOwnProperty.call(config.slots, key)) {
      const slot = key as colorSchemaSlots;
      let colors = config.slots[slot];
      if (typeof colors === "string") {
        colors = [colors];
      }
      if (colors && colors.length > 0) {
        availableSlots.push({ slot, colors });
      }
    }
  }

  const [selectedSlot, setSelectedSlot] = useState<colorSchemaSlots|undefined>(
    availableSlots[0]?.slot
  );

  const onPickerChange = (color: ColorResult) => {
    if (selectedSlot == null) {
      return;
    }

    onChangeColor && onChangeColor(selectedSlot, color.hex);
  };

  const onDelete = (slot: colorSchemaSlots) => {
    setSelectedSlot(undefined);
    onChangeColor && onChangeColor(slot, undefined);
  };

  const toggleSlot = (slot: colorSchemaSlots) => {
    setSelectedSlot((currentSlot) => (currentSlot === slot ? undefined : slot));
  };

  return (
    <div className={styles.UserColors}>
      {availableSlots.map(({ slot }) => {
        return (
          <div className={styles.row} key={slot}>
            <IconButton size="small" onClick={() => onDelete(slot)}>
              <DeleteForeverIcon />
            </IconButton>
            <ColorSlot
              key={slot}
              slot={slot}
              userColor={execution?.userDefinedColors?.[slot]}
              selected={selectedSlot === slot}
              onChange={() => toggleSlot(slot)}
            />
          </div>
        );
      })}

      <ChromePicker
        className={combineClasses({
          [styles.Picker]: true,
          [styles.disabled]: !selectedSlot,
        })}
        disableAlpha={true}
        color={selectedSlot && execution.userDefinedColors?.[selectedSlot]}
        onChangeComplete={onPickerChange}
      />
    </div>
  );
}
