import { ToingData } from "../lib/lottie";
import styles from "./DemoLoader.module.css";
import { createPublicLottieSampleUrl } from "./utils";

type Props = {
  onLoadedData?: (toingData: ToingData | undefined) => void;
};

const DemoLoader = ({ onLoadedData }: Props) => {
  async function handleClick() {
    const config = await (
      await fetch(createPublicLottieSampleUrl("SAMPLE 1.config.json"))
    ).json();

    const data: ToingData = {
      src: createPublicLottieSampleUrl("SAMPLE 1.json"),
      config,
      // execution:
      // campaign:
    };
    onLoadedData && onLoadedData(data);
  }
  function handleClear() {
    onLoadedData && onLoadedData(undefined);
  }

  return (
    <div className={styles.root}>
      <div>loader</div>
      <button onClick={handleClick}>load</button>
      <button onClick={handleClear}>clear</button>
    </div>
  );
};

export default DemoLoader;
