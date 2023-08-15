import { combineClasses } from "../../../utils/css";
import styles from "./ColorBox.module.css";

type Props = {
  color: string;
  small?: boolean;
};

export default function ColorBox({ color, small }: Props) {
  return (
    <div
      className={combineClasses({
        [styles.ColorBox]: true,
        [styles.small]: small != null && small,
      })}
      style={{ backgroundColor: color }}
    ></div>
  );
}
