import { LottieColorHelper } from "../../core/LottieColorHelper";
import {
  colorSchemaSlotToName,
  colorSchemaSlots,
  getEmptyColorsPalette,
} from "../../core/colorSchema";
import { EditProps } from "../../modules/editorUiModule";
import styles from "./ColorsEditView.module.css";
import { Config, Execution } from "./ColorsExecuter";
import ColorBox from "./extra/ColorBox";

type Props = EditProps<Config, Execution>;

export default function ColorsEditView({
  editEndpoint,
  execution,
  onChange,
}: Props) {
  const { config } = editEndpoint;

  const onChangeColor = (slot: colorSchemaSlots, color: string) => {
    const newExecution = { ...execution };
    newExecution.isCustomPalette = true;
    newExecution.userDefinedColors = {
      ...getEmptyColorsPalette(),
      ...newExecution.userDefinedColors,
    };
    newExecution.userDefinedColors[slot] = color;

    onChange && onChange(newExecution);
  };

  return (
    <div className={styles.root}>
      {/* <pre> {JSON.stringify(execution, null, 2)}</pre> */}
      {config.slots &&
        Object.entries(config.slots).map(([key, color], i) => {
          const slot = key as colorSchemaSlots;
          return (
            color && (
              <ColorSlot
                key={slot}
                slot={slot}
                paletteColor={color}
                userColor={execution?.userDefinedColors?.[slot] ?? color}
                onChange={(color) => onChangeColor(slot, color)}
              />
            )
          );
        })}
    </div>
  );
}

function ColorSlot({
  slot,
  paletteColor,
  userColor,
  onChange,
}: {
  slot: colorSchemaSlots;
  paletteColor: string;
  userColor: string;
  onChange?: (color: string) => void;
}) {
  const changeColor = () => {
    const radomColorArr = [Math.random(), Math.random(), Math.random()];
    const radomColorHex = LottieColorHelper.rgbToHex(radomColorArr);
    onChange && onChange(radomColorHex);
  };

  return (
    <div className={styles.ColorSlot} onClick={changeColor}>
      <ColorBox color={paletteColor} small />
      {"->"}
      <ColorBox color={userColor} small />
      <div>{colorSchemaSlotToName(slot)}</div>
    </div>
  );
}
