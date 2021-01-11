import * as React from 'react';
import { useChipper } from '../lib';

type Theme = {
  dark: boolean;
  color: string;
};
type User = {
  uid: string;
  name: string;
};
export const Two: React.FC = () => {
  const user = useChipper<User>('user');
  const theme = useChipper<Theme>('theme');
  const onClickOne = () => {
    user.set((draft) => {
      // draft.name = 'wfwo';
      draft.uid = 'reie';
    });
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
      <pre>user data:{JSON.stringify(user.data)}</pre>
      <pre>user status:{JSON.stringify(user.status)}</pre>
      <pre>theme data: {JSON.stringify(theme.data)}</pre>
    </div>
  );
};
