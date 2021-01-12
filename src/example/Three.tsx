import * as React from "react";
import { useChip } from "../lib/Chipper";
import { useRenderCounter } from "../lib/Counter";

type User = {
  uid: string;
  name: string;
};
export const Three: React.FC = () => {
  const [count] = useRenderCounter("three");
  const user = useChip<User>("user");
  const onClick = () => {
    user.set(
      (draft) => {
        draft.name = "asd";
      },
      {
        timeout: 2000
      }
    );
  };
  console.log("user", user);
  return (
    <div>
      <div>THREE</div>
      <button onClick={onClick}>set</button>
      <pre>{JSON.stringify(user.data)}</pre>
      <pre>{JSON.stringify(user.status)}</pre>
      <pre>rerenders: {count}</pre>
    </div>
  );
};
