import { useId } from "react";
import { LottieColorHelper } from "../../core/LottieColorHelper";
import {
  PaletteOption,
  colorSchemaSlotToName,
  colorSchemaSlots,
  getEmptyColorsPalette,
} from "../../core/colorSchema";
import { EditProps } from "../../modules/editorUiModule";
import styles from "./ColorsEditView.module.css";
import { ColorPaletteSource, Config, Execution } from "./ColorsExecuter";
import ColorBox from "./extra/ColorBox";
import useToingStore from "../../stores/ToingStore";

type Props = EditProps<Config, Execution>;

export default function ColorsEditView({
  editEndpoint,
  execution,
  onChange,
}: Props) {
  const id = useId();

  const { config } = editEndpoint;
  const campaign = useToingStore((store) => store.campaign);

  const source = execution.paletteSource;

  const onChangeColor = (slot: colorSchemaSlots, color: string) => {
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
        <label htmlFor={`${id}-campaign`}>campaign</label>

        { campaign?.colors && campaign?.colors[0] && (
          <>
            <div className={styles.gap} />
            <Palette palette={campaign.colors[0]} />
          </>
        )}
      </div>

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

      {source === "user" &&
        config.slots &&
        Object.entries(config.slots).map(([key, colors], i) => {
          const slot = key as colorSchemaSlots;
          if (typeof colors === "string") {
            colors = [colors];
          }
          return (
            colors &&
            colors.length > 0 && (
              <ColorSlot
                key={slot}
                slot={slot}
                userColor={
                  execution?.userDefinedColors?.[slot] ??
                  colors?.at(0) ??
                  "#000000ff"
                }
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
  userColor,
  onChange,
}: {
  slot: colorSchemaSlots;
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
      <ColorBox color={userColor} size="small" />
      <div>{colorSchemaSlotToName(slot)}</div>
    </div>
  );
}

function Palette({ palette }: { palette: PaletteOption }) {
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
