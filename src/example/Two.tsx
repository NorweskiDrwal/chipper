import * as React from "react";
import { useChip } from "../lib";
import { mockAsync } from "../lib/utils";
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
  const theme = useChip<Theme>("theme");
  const user = useChip<User>("user");

  const onTheme = () => {
    theme.set((theme) => {
      theme.dark = false;
    });
  };
  const onMockClick = () => {
    theme.set(
      (theme) => {
        theme.color = "orange";
      },
      {
        timeout: 2000
      }
    );
  };
  const onAsyncClick = async () => {
    const someAsyncRequest = mockAsync(
      { dark: true, color: "worvnjwrnv" },
      1234
    );
    theme.set(someAsyncRequest);
  };
  const onUser = () => {
    theme.api.set<User>({ uid: "56789", name: "tigger" }, "user");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p>THEME</p>
      <div>
        <button onClick={onTheme}>set theme</button>
        <button onClick={onMockClick}>set mock theme 2s</button>
        <button onClick={onAsyncClick}>set async theme</button>
        <button onClick={onUser}>set user</button>
      </div>
      <pre>theme data: {JSON.stringify(theme.data)}</pre>
      <pre>theme status: {JSON.stringify(theme.status)}</pre>
      <pre>user status: {JSON.stringify(user.status)}</pre>
      <pre>renders: {count}</pre>
    </div>
  );
};
