import * as React from "react";
import produce, { Draft } from "immer";

import Chipper from "../Chipper";
import * as Utils from "../utils";
import { IChip, IData, IOptions } from "../types";

type IDraft<T = IData> = (data: Draft<T>) => void;
type IDispatch<T = IData> = (chip: Draft<IChip<T>>) => void;
type ISet<T = IData> = T | IDraft<T>;
type IMaybeSet<T = IData> = Promise<T>;
type IUpdate<T = IData> = ISet<T> | IMaybeSet<T>;

function chopper<T = IData>(key: string, chop: IChip<T>, update: ISet<T>) {
  let updated;
  const isFunction = typeof update === "function";
  if (isFunction) updated = produce(chop.data, update as IDraft);
  else updated = produce(chop.data, () => update);
  return { ...chop, data: updated, key } as IChip<T>;
}

function inequalityCheck<T = IChip<IData>>(chop: T, chip: T) {
  return JSON.stringify(chop) !== JSON.stringify(chip);
}

export default function useChip<T = IData>(key: string, data?: T) {
  const query = Chipper.queryQueue(key, data);
  const chop = query.get();
  const [, updater] = React.useState(chop) as [never, IDispatch];

  React.useEffect(() => {
    Chipper.enqueue(key, updater);
    return () => Chipper.dequeue(updater);
  }, [key]);

  const set = async (update: IUpdate<T>, options?: IOptions<T>) => {
    if (chop.status.type !== "LOADING") {
      const updateRunner = async (run: (chip: IChip<T>) => void) => {
        const chip = chopper(key, chop, update as ISet<T>);
        if (update instanceof Promise)
          await Utils.makeAsync(query, update, options as IOptions);
        else if (inequalityCheck(chop, chip)) run(chip);
      };
      if (options?.timeout! > 0) {
        updateRunner(async (chip) => {
          const async = Utils.mockAsync(chip.data, options?.timeout);
          await Utils.makeAsync(query, async, options as IOptions);
        });
      } else updateRunner((chip) => query.set(chip));
    }
  };

  return { data: chop.data, status: chop.status, set };
}
