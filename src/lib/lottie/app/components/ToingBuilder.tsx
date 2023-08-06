import styles from "./ToingBuilder.module.css";

type Props = {
  url: string;
  config: {};
  execution: {};
  campaign: {};
  
};

function ToingBuilder({}: Props) {
  return <div className={styles.root}>ToingBuilder</div>;
}

export default ToingBuilder;
