import { Draft } from "immer";

export type IError = Error | string;
export type IData = Record<string | number | symbol, unknown>;
export type IQueue<T = IData> = [string, T][];
export type IChips<T = IData> = Map<string, IChip<T>>;
export type IDraft<T = IData> = (data: Draft<T>) => void;
export type IDispatch<T = IData> = (chip: Draft<IChip<T>>) => void;
export type ISet<T = IData> = T | IDraft<T>;
export type IMaybeSet<T = IData> = Promise<T>;
export type IUpdate<T = IData> = ISet<T> | IMaybeSet<T>;
export type IStatus = {
  type: "IDLE" | "LOADING" | "ERROR" | "SUCCESS";
  message?: IError;
};
export type QUpdate = (chip: IChip) => void;
export type QUpdater = { key: string; update: QUpdate };

export interface IOptions<T = any> {
  timeout?: number;
  onInit?: () => void;
  onSuccess?: (resp: T) => void;
  onError?: (error: IError) => void;
  wrapResp?: (...args: any[]) => T;
}
export interface IChip<T = IData> {
  data: T | undefined;
  status: IStatus;
}
export interface IQuery<T = IData> {
  cut: () => boolean;
  get: () => IChip<T>;
  set: (chip: T | IChip<T>) => void;
}
