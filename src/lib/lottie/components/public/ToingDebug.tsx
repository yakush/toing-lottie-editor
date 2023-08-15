import useToingStore from "../../stores/ToingStore";
import { withToingStore } from "../ToingStoreWrapper";
import { ToingPublicProps } from "../toing-public-props";
import { Card, CardContent } from "@mui/material";
import styles from "./ToingDebug.module.css";
import { useMemo, useState } from "react";
import { Lottie } from "../../types";
import { LottieColorRefHelper } from "../../core/LottieColorRefHelper";

type Props = ToingPublicProps & {};

const ToingDebug = withToingStore((props: Props) => {
  const lottie = useToingStore((store) => store.lottie);
  const config = useToingStore((store) => store.config);
  const userExecutions = useToingStore((store) => store.userExecutions);
  const campaign = useToingStore((store) => store.campaign);

  return (
    <div className={styles.root}>
      <Colors lottie={lottie} />
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
function Colors({ lottie }: { lottie?: Lottie }) {
  if (!lottie) {
    return <div></div>;
  }

  const groups = LottieColorRefHelper.getColorGroups(lottie);

  return (
    <div>
      {groups.map((item, i) => (
        <div key={i}>
          <div style={{ backgroundColor: item.colorHex, padding: 5 }}>
            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.8)",
                padding: 3,
              }}
            >
              {item.refs.length} x {item.colorHex}
              {item.refs.map((ref, i) => (
                <div key={i}>{ref.type}</div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

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
