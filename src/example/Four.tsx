import * as React from "react";
import { useChip } from "../lib/Chipper";
import { useRenderCounter } from "../lib/Counter";

type Theme = {
  dark: boolean;
  color: string;
};
export const Four: React.FC = () => {
  const [count] = useRenderCounter("four");
  const theme = useChip<Theme>("theme");
  // const user = useChip("user");
  const onClick = () => {
    theme.set((draft) => {
      draft.color = "asd";
    });
  };
  // console.log("theme", theme);
  return (
    <div>
      <div>FOUR</div>
      <button onClick={onClick}>set</button>
      {/* <pre>{JSON.stringify(user.data)}</pre>
      <pre>{JSON.stringify(user.status)}</pre> */}
      <pre>rerenders: {count}</pre>
    </div>
  );
};
