import { combineClasses } from "../../../utils/css";
import styles from "./ColorBox.module.css";

type Props = {
  color?: string;
  size?: "normal" | "small" | "tiny" | "slot";
};

export default function ColorBox({ color, size }: Props) {
  const noColor = !color;
  color = noColor ? "#ffffff" : color;

  return (
    <div
      className={combineClasses({
        [styles.ColorBox]: true,
        [styles.small]: size != null && size === "small",
        [styles.tiny]: size != null && size === "tiny",
        [styles.slot]: size != null && size === "slot",
        [styles.noColor]: noColor,
      })}
      style={{ backgroundColor: color }}
    ></div>
  );
}
