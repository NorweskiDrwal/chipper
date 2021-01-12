import * as TS from "./types";

type Update = (chip: TS.IChip) => void;
type Updater = {
  key: string;
  update: Update;
};

function newChip<T = TS.IData>(data?: T): TS.IChip<T> {
  return { data, status: { type: "IDLE" } };
}

class ChipperQueue {
  queue: Updater[] = [];

  public enqueue(key: string, update: Update) {
    this.queue.push({ key, update });
  }
  public dequeue(update: Update) {
    this.queue = this.queue.filter((chip) => update !== chip.update);
  }
  public convey(key: string, chip: TS.IChip) {
    this.queue.forEach((convey) => {
      if (key === convey.key) convey.update(chip);
    });
  }
}

const Chips = new Map<string, TS.IChip>();

class ChipperOperator extends ChipperQueue {
  public createQueue(queue: TS.IQueue) {
    queue.map((que) => Chips.set(que[0], newChip(que[1])));
  }
  public queryQueue<T = TS.IData>(key: string, data?: T) {
    if (!Chips.has(key)) Chips.set(key, newChip(data) as TS.IChip);
    return {
      get: () => Chips.get(key) as TS.IChip<T>,
      cut: () => Chips.delete(key),
      set: (chip: TS.IChip<T>) => {
        Chips.set(key, chip as TS.IChip);
        this.convey(key, chip as TS.IChip);
      }
    };
  }
}

const Chipper = new ChipperOperator();

// console.log("Chipper", Chipper);

export { default as useChip } from "./hooks/use-chip";
export default Chipper;
