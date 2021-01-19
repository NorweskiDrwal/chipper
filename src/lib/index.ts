import * as React from "react";

import * as TS from "./types";
import * as Utils from "./utils";

class ChipperQueue {
  queue: TS.QUpdater[] = [];

  enqueue(key: string, update: TS.QUpdate) {
    this.queue.push({ key, update });
  }
  dequeue(update: TS.QUpdate) {
    this.queue = this.queue.filter((chip) => update !== chip.update);
  }
  convey(key: string, chip: TS.IChip) {
    this.queue.forEach((convey) => key === convey.key && convey.update(chip));
  }
}

export class ChipperOperator extends ChipperQueue {
  chips = new Map<string, TS.IChip>();

  createQueue(queue: TS.IQueue) {
    queue.map((que) => this.chips.set(que[0], Utils.newChip(que[1])));
  }
  queryQueue<T = TS.IData>(key: string, data?: T) {
    if (!this.chips.has(key))
      this.chips.set(key, Utils.newChip(data) as TS.IChip);
    return {
      get: (cKey?: string) => this.chips.get(cKey || key) as TS.IChip<T>,
      cut: (cKey?: string) => this.chips.delete(cKey || key),
      set: <R = T>(chop: R | TS.IChip<R>, cKey?: string) => {
        if (!(chop instanceof Promise)) {
          let chip = chop as TS.IChip<R>;
          if (chip.status === undefined) chip = Utils.newChip(chop as R);
          this.chips.set(cKey || key, chip as TS.IChip);
          this.convey(cKey || key, chip as TS.IChip);
        }
      }
    };
  }
}

const Chipper = new ChipperOperator();

export function useChipper<T = TS.IData>(key: string, data?: T) {
  const query = Chipper.queryQueue(key, data);
  const chop = query.get();
  const [, updater] = React.useState(chop) as [never, TS.IDispatch];
  const isLoading = chop.status?.type === "LOADING";

  React.useEffect(() => {
    Chipper.enqueue(key, updater);
    return () => {
      if (!isLoading) Chipper.dequeue(updater);
    };
  }, [key, isLoading]);

  const set = async (update: TS.IUpdate<T>, options?: TS.IOptions<T>) => {
    if (!isLoading) {
      const updateRunner = async (run: (chip: TS.IChip<T>) => void) => {
        const chip = Utils.chopper(key, chop, update as TS.ISet);
        if (update instanceof Promise)
          await Utils.makeAsync(key, query, update, options);
        else if (Utils.inequalityCheck(chop, chip)) run(chip);
      };
      if (options?.timeout! > 0) {
        updateRunner(async (chip) => {
          const async = Utils.mockAsync(chip.data, options?.timeout);
          await Utils.makeAsync(key, query, async, options);
        });
      } else updateRunner(query.set);
    }
  };

  return { data: chop?.data as T, status: chop?.status, set, api: query };
}
export default Chipper;
