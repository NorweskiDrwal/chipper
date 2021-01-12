import * as React from 'react';

import Chipper from '..';
import * as TS from '../types';
import * as Utils from '../utils';

export default function useChipper<T = TS.IData>(key: string, data?: T) {
  if (!Chipper.Queue.has(key)) Chipper.Queue.set(key, Utils.newChip(data) as TS.IChip);

  const Query = Chipper.chipperQuery(key);
  const chop = Query.get() || (Utils.newChip(data) as TS.IChip);
  const [, updater] = (React.useState(chop) as unknown) as [never, TS.IUpdater];

  function inequalityCheck(chop: TS.IChip, chip: TS.IChip) {
    return JSON.stringify(chop) !== JSON.stringify(chip);
  }

  React.useEffect(() => {
    Chipper.Conveyor.add(updater);
    return () => {
      Chipper.Conveyor.delete(updater);
    };
  }, []);

  function set(update: TS.IUpdate<T>, options?: TS.IOptions<T>) {
    if (chop.status.type !== 'LOADING') {
      const chip = Utils.chopper(chop, update as TS.IUpdate);

      const updateRunner = async (update: () => void) => {
        if (update instanceof Promise) await Utils.makeAsync(Query, update, options as TS.IOptions);
        else if (inequalityCheck(chop, chip)) update();
      };

      if (options?.timeout! > 0) {
        updateRunner(async () => {
          const async = Utils.mockAsync(chip.data, options?.timeout);
          await Utils.makeAsync(Query, async, options as TS.IOptions);
        });
      } else
        updateRunner(() => {
          Query.set(chip);
        });

      // updater(update as TS.IUpdate);
    }
  }

  return { set, data: chop.data as T, status: chop.status };
}
