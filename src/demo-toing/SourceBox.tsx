import { Card, IconButton, Typography } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { ChangeEvent, useEffect, useId, useState } from "react";
import styles from "./SourceBox.module.css";

type Props = {
  title: string;
  onChangeSource?: (source: string | File | undefined) => void;
  defaultUrl?: string;
};

export default function SourceBox({
  title,
  defaultUrl,
  onChangeSource,
}: Props) {
  const id = useId();
  const [file, setFile] = useState<File | null>();
  const [filepath, setFilepath] = useState<string>("");
  const [url, setUrl] = useState<string | undefined>(defaultUrl ?? "");

  //fire event :
  useEffect(() => {
    if (!!file) {
      onChangeSource && onChangeSource(file);
    } else if (!!url) {
      onChangeSource && onChangeSource(url);
    } else {
      onChangeSource && onChangeSource(undefined);
    }
  }, [file, onChangeSource, url]);

  //updates:
  const changeUrl = (url: string) => {
    setFile(undefined);
    setFilepath("");
    setUrl(url);
  };
  const changeFile = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files && event.target.files[0]);
    setFilepath(event.target.value);
    setUrl("");
  };
  const clear = () => {
    setFile(undefined);
    setFilepath("");
    setUrl("");
  };

  //JSX
  return (
    <Card variant="outlined" className={styles.root}>
      <Typography className={styles.title}>{title}</Typography>

      <IconButton onClick={() => clear()}>
        <DeleteForeverIcon />
      </IconButton>

      <div className={styles.file} data-selected = {!!filepath}>
        <input type="file" value={filepath} onChange={(e) => changeFile(e)} />
      </div>
      <span> -- OR -- </span>
      <div className={styles.url} data-selected = {!!url}>
        <label htmlFor={`${id}-url`}>url:</label>
        <input
          id={`${id}-url`}
          type="text"
          value={url}
          onChange={(event) => changeUrl(event.target.value)}
        />
      </div>
    </Card>
  );
}
