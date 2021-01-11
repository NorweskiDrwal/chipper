import * as React from 'react';
import { useChipper } from '../lib';

type User = {
  uid: string;
  name: string;
};
export const One: React.FC = () => {
  const user = useChipper<User>('user');
  const onClick = () => {
    user.set(
      (draft) => {
        draft.uid = 'asd';
      },
      {
        timeout: 3000,
        onInit: () => console.log('init'),
        onError: (error) => console.log('error', error),
        onSuccess: (resp) => console.log('resp', resp),
      },
    );
  };
  return (
    <div>
      <div>ONE</div>
      <button onClick={onClick}>set</button>
      <pre>{JSON.stringify(user.data)}</pre>
      <pre>{JSON.stringify(user.status)}</pre>
    </div>
  );
};
