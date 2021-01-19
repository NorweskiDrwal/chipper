import * as React from "react";
import { useChipper } from "../lib";
import { IChip } from "../lib/types";

const styles = {
  wrapper: {
    backgroundColor: "red",
    borderRadius: 8,
    padding: 8
  }
};

type Props = {
  chips: string[];
};

export const Chips: React.FC<Props> = ({ chips }) => {
  return (
    <div style={styles.wrapper}>
      {/* <div>{name}</div>
      <div>data: {JSON.stringify(chip.data)}</div>
      <div>status: {JSON.stringify(chip.status)}</div> */}
    </div>
  );
};
