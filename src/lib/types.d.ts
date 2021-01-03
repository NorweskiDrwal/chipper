export type IData<T = any> = T | undefined | null;
export type IQueue<T = any> = [string, IData<T>][];
export type IMaybeData<T = any> = Promise<IData<T> | void>;
export type IUpdater<T = any> = (draft: IChip<T>) => void;
export type IUpdate<T = any> = IData<T> | IMaybeData<T> | IUpdater<T>;
export type IStatus = {
  type: 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';
  message?: Error | string;
};
export type IChip<T> = {
  data: IData<T>;
  status: IStatus;
};
export interface IUseChip<T> extends IChip<T> {
  key: string;
  set: (update: IUpdate<T>) => void;
}
export type IChips<T = any> = Map<string, IUseChip<T>>;
