import * as React from "react";
import { useChip } from "../lib";
import { useRenderCounter } from "./Counter";

type Theme = {
  dark: boolean;
  color: string;
};
type User = {
  uid: string;
  name: string;
};
export const Two: React.FC = () => {
  const [count] = useRenderCounter("theme");
  // const user = useChipper<User>("user");
  const theme = useChip<Theme>("theme");
  const onClickOne = () => {
    theme.set(
      (draft) => {
        draft.color = "asd";
      },
      {
        timeout: 1000,
        onInit: () => console.log("init"),
        onError: (error) => console.log("error", error),
        onSuccess: (resp) => console.log("resp", resp),
      }
    );
  };
  const onClickTwo = () => {
    theme.set((draft) => {
      draft.dark = false;
    });
  };

  return (
    <div>
      <div>TWO</div>
      <button onClick={onClickOne}>set one</button>
      <button onClick={onClickTwo}>set two</button>
      {/* <pre>user data: {JSON.stringify(user.data)}</pre>
      <pre>user status: {JSON.stringify(user.status)}</pre> */}
      <pre>theme data: {JSON.stringify(theme.data)}</pre>
      <pre>theme status: {JSON.stringify(theme.status)}</pre>
      <pre>renders: {count}</pre>
    </div>
  );
};
