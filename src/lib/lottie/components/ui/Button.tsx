import { ReactNode, forwardRef } from "react";
import { combineClasses } from "../../utils/css";
import styles from "./Button.module.css";

type Props = {
  children?: ReactNode;
};

type ButtonProps = Props & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { children, className, ...rest } = props;
  return (
    <button
      className={combineClasses(styles.root, className)}
      ref={ref}
      {...rest}
    >
      {children}
    </button>
  );
});

export default Button;
