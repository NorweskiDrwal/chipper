import * as React from "react";
import { useChip } from "../lib";
import { mockAsync } from "../lib/utils";
import { useRenderCounter } from "./Counter";

type User = {
  uid: string;
  name: string;
};
type Theme = {
  dark: boolean;
  color: string;
};

export const One: React.FC = () => {
  const [count] = useRenderCounter("user");
  const user = useChip<User>("user");
  // const theme = useChip<Theme>("theme");

  const onUser = () => {
    user.set((draft) => {
      draft.name = "dragonsaurus";
    });
  };
  const onMockClick = () => {
    user.set(
      (draft) => {
        draft.name = "pierogi";
      },
      {
        timeout: 2000
      }
    );
  };
  const onAsyncClick = async () => {
    const someAsyncRequest = mockAsync({ uid: "56789", name: "tigger" }, 1234);
    user.set(someAsyncRequest);
  };
  const onTheme = () => {
    user.api.set<Theme>({ dark: true, color: "bobololo" }, "theme");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p>USER</p>
      <div>
        <button onClick={onUser}>set user</button>
        <button onClick={onMockClick}>set mock user 2s</button>
        <button onClick={onAsyncClick}>set async user</button>
        <button onClick={onTheme}>set theme</button>
      </div>
      <pre>user data: {JSON.stringify(user.data)}</pre>
      <pre>user status: {JSON.stringify(user.status)}</pre>
      {/* <pre>theme status: {JSON.stringify(theme.status)}</pre> */}
      <pre>renders: {count}</pre>
    </div>
  );
};
