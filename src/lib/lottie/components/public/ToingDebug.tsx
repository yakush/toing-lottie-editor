import useToingStore from "../../stores/ToingStore";
import { withToingStore } from "../ToingStoreWrapper";
import { ToingPublicProps } from "../toing-public-props";
import { Card, CardContent } from "@mui/material";
import styles from "./ToingDebug.module.css";
import { useMemo, useState } from "react";

type Props = ToingPublicProps & {};

const ToingDebug = withToingStore((props: Props) => {
  const displayName = useToingStore((store) => store.displayName);
  const lottie = useToingStore((store) => store.lottie);
  const config = useToingStore((store) => store.config);
  const userExecutions = useToingStore((store) => store.userExecutions);
  const campaign = useToingStore((store) => store.campaign);

  return (
    <div className={styles.root}>
      {/* <div> displayName: {JSON.stringify(displayName)}</div> */}
      <div className={styles.items}>
        <Content title={"lottie"} data={lottie} />
        <Content title={"config"} data={config} />
        <Content title={"campaign"} data={campaign} />
        <Content title={"userExecutions"} data={userExecutions} />
      </div>
    </div>
  );
});

//-------------------------------------------------------
//-------------------------------------------------------

type ContentProps = {
  title: string;
  data?: any;
};

function Content({ data, title }: ContentProps) {
  const [opened, setOpened] = useState(false);
  const json = useMemo(() => JSON.stringify(data, null, 2), [data]);

  const copyToClipboard = () => {
    console.log(json);
    navigator.clipboard.writeText(json);
  };

  return (
    <Card variant="outlined" className={styles.item}>
      <div className={styles.itemHeader}>
        <div>{title}</div>
        <button onClick={copyToClipboard}>copy to clipboard</button>
        <button onClick={() => setOpened((x) => !x)}>
          {opened ? "close" : "open"}
        </button>
      </div>

      <CardContent>
        <pre
          className={styles.json}
          data-opened={opened}
          onDoubleClick={() => setOpened((x) => !x)}
        >
          {json}
        </pre>
        {/* <textarea disabled value={json} /> */}
      </CardContent>
    </Card>
  );
}

export { ToingDebug };
export default ToingDebug;
