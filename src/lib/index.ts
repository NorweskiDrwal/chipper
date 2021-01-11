import { newChip } from './utils';
import { IChips, IQueue, IConvey, IChip } from './types';

export class ChipperOperator {
  Queue: IChips;
  Conveyor: IConvey;

  constructor() {
    this.Queue = new Map();
    this.Conveyor = new Set();
  }

  public createQueue(queue: IQueue) {
    const chippedQueue: [string, IChip][] = [];
    queue.map((que) => chippedQueue.push([que[0], newChip(que[1])]));
    this.Queue = new Map(chippedQueue);
  }
  public chipperQuery(key: string) {
    return {
      get: () => this.grabFromQueue(key),
      set: (chip: IChip) => this.addToQueue(key, chip),
      cut: (chip: IChip) => this.removeFromQueue(key, chip),
    };
  }
  public convey(chip: IChip) {
    this.Conveyor.forEach((convey) => convey(chip as any));
  }

  private addToQueue(key: string, chip: IChip) {
    this.Queue.set(key, chip);
    this.convey(chip);
  }
  private removeFromQueue(key: string, chip: IChip) {
    this.Queue.delete(key);
    this.convey(chip);
  }
  private grabFromQueue(key: string) {
    return this.Queue.get(key);
  }
}

const Chipper = new ChipperOperator();

export { default as useChipper } from './hooks/use-chipper';
export default Chipper;
