import * as React from "react";
import { useChipper } from "../lib";

const styles = {
  wrapper: {
    backgroundColor: "blue",
    borderRadius: 8,
    padding: 8
  }
};

export const Actions: React.FC = () => {
  const [input, setInput] = React.useState("");
  const [key, setKey] = React.useState("");
  const chip = useChipper(key);

  const onChange = (e: any) => setInput(e.target.value);
  const onClick = () => setKey(input);
  const onSet = () => {
    chip.set("asd");
  };

  return (
    <div style={styles.wrapper}>
      <input value={input} placeholder="enter data name" onChange={onChange} />
      <button onClick={onClick}>select</button>
      <button onClick={onSet}>set {key}</button>
    </div>
  );
};
