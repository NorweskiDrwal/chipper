import * as React from "react";
import * as Utils from "./utils";

export type IData = Record<string, unknown> | string;
interface IStatus { type: 'IDLE' | 'LOADING' | 'ERROR' | 'SUCCESS'; message?: Error | string }
export interface IChip<T = IData> { data: T; status: IStatus }
type IUpque<T = IData> = IChip<T> | ((chip: IChip<T>) => IChip<T>);
interface IQue<T = IData> { key: string; update: IUpque<T> }
type IQueue<T = IData> = [string, T][];

class ChipperQueue {
  queue: IQue[] = [];

  enqueue(key: string, update: IUpque) {
    this.queue.push({ key, update });
  }
  dequeue(update: IUpque) {
    this.queue = this.queue.filter((chip) => update !== chip.update);
  }
  convey(key: string, chip: IChip) {
    this.queue.forEach((convey) => {
      if (key === convey.key) {
        if (typeof convey.update === 'function') convey.update(chip);
        else convey.update = chip;
      }
    });
  }
}

export class ChipperOperator extends ChipperQueue {
  chips = new Map<string, IChip>();

  createQueue(queue: IQueue) {
    queue.map((que) => this.chips.set(que[0], Utils.newChip(que[1])));
  }
  queryQueue<T = IData>(key: string, data: T) {
    if (!this.chips.has(key)) this.chips.set(key, Utils.newChip(data))
    return {
      get: (k?: string) => this.chips.get(k || key),
      cut: (k?: string) => this.chips.delete(k || key),
      set: <R = T>(data: R | IChip<R>, k?: string) => {
        let chip = data as IChip;
        if (typeof data !== "function" && !(data instanceof Promise)) {
          if (chip.status === undefined) chip = Utils.newChip(data);
          const check = Utils.equalityCheck(data, chip);
          if (check === 'update') {
            this.chips.set(k || key, chip);
            this.convey(k || key, chip);
          } else if (check === 'warn') console.warn("ChipperError: You're changing data shape");
        } else console.warn("ChipperError: Promises and functions are ignored");
      }
    };
  }
}

function ChipperConveyor<T = IData>(chipper: ChipperOperator, key: string, data?: T) {
  const query = chipper.queryQueue(key, data);
  const chop = query.get();
  const [, updater] = React.useState(chop) as [never, any];

  React.useEffect(() => {
    chipper.enqueue(key, updater);
    return () => {
      chipper.dequeue(updater);
    };
  }, [chipper, key]);

  return query;
}

export function useChipper<T = IData>(chipper: ChipperOperator, key: string, data?: T) {
  const Query = ChipperConveyor(chipper, key, data);
}

const Chipper = new ChipperOperator();
export function useChip<T = IData>(key: string, data?: T) {
  const Query = ChipperConveyor(Chipper, key, data);
}

export default Chipper;