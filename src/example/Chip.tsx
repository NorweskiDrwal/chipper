import * as React from "react";
import { useChipper } from "../lib";

import { useRenderCounter } from "./Counter";

const styles = {
  wrapper: {
    backgroundColor: "red",
    borderRadius: 8,
    padding: 8
  }
};

type Props = {
  name: string;
};

export const Chip: React.FC<Props> = ({ name }) => {
  const [count] = useRenderCounter(name);
  const chip = useChipper(name);

  console.log(chip.api.set("asd", "theme"));

  return (
    <div style={styles.wrapper}>
      <div>{name}</div>
      <div>data: {JSON.stringify(chip.data)}</div>
      <div>status: {JSON.stringify(chip.status)}</div>
      <div>renders: {count}</div>
    </div>
  );
};
