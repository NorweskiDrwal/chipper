import * as React from "react";

import * as TS from "./types";
import * as Utils from "./utils";

class ChipperQueue {
  queue: TS.QUpdater[] = [];

  public enqueue(key: string, update: TS.QUpdate) {
    this.queue.push({ key, update });
  }
  public dequeue(update: TS.QUpdate) {
    this.queue = this.queue.filter((chip) => update !== chip.update);
  }
  public convey(key: string, chip: TS.IChip) {
    this.queue.forEach((convey) => key === convey.key && convey.update(chip));
  }
}

class ChipperOperator extends ChipperQueue {
  chips = new Map<string, TS.IChip>();

  public createQueue(queue: TS.IQueue) {
    queue.map((que) => this.chips.set(que[0], Utils.newChip(que[1])));
  }
  public queryQueue<T = TS.IData>(key: string, data?: T) {
    if (!this.chips.has(key))
      this.chips.set(key, Utils.newChip(data) as TS.IChip);
    return {
      get: () => this.chips.get(key) as TS.IChip<T>,
      cut: () => this.chips.delete(key),
      set: (chip: TS.IChip<T>) => {
        this.chips.set(key, chip as TS.IChip);
        this.convey(key, chip as TS.IChip);
      }
    };
  }
}

const Chipper = new ChipperOperator();

export function useChipper<T = TS.IData>(key: string, data?: T) {
  const query = Chipper.queryQueue(key, data);
  const chop = query.get();
  const [, updater] = React.useState(chop) as [never, TS.IDispatch];
  const isLoading = chop.status.type === "LOADING";

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
          await Utils.makeAsync(query, update, options);
        else if (Utils.inequalityCheck(chop, chip)) run(chip);
      };
      if (options?.timeout! > 0) {
        updateRunner(async (chip) => {
          const async = Utils.mockAsync(chip.data, options?.timeout);
          await Utils.makeAsync(query, async, options);
        });
      } else updateRunner((chip) => query.set(chip));
    }
  };

  return { data: chop?.data, status: chop?.status, set };
}
export default Chipper;
