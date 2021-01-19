import * as React from "react";
import { useChipper } from "../lib";
import { useRenderCounter } from "./Counter";

type User = {
  uid: string;
  name: string;
};
export const One: React.FC = () => {
  const [count] = useRenderCounter("user");
  const user = useChipper<User>("user");
  const onClick = () => {
    user.set(
      (draft) => {
        draft.name = "dragonsaurus";
      },
      {
        timeout: 1000,
        persist: true,
        onInit: () => console.log("init"),
        onError: (error) => console.log("error", error),
        onSuccess: (resp) => console.log("resp", resp)
      }
    );
  };

  return (
    <div>
      <div>ONE</div>
      <button onClick={onClick}>set</button>
      <pre>data: {JSON.stringify(user.data)}</pre>
      <pre>status: {JSON.stringify(user.status)}</pre>
      <pre>renders: {count}</pre>
    </div>
  );
};
