import { Draft } from "immer";

export type IError = Error | string;
export type IData =
  | null
  | string
  | number
  | symbol
  | Record<string | number | symbol, unknown>;
export type IQueue<T = IData> = [string, T][];
export type IChips<T = IData> = Map<string, IChip<T>>;
export type IUpdate<T = IData> = T | IDraft<T>;
export type IUpdater<T = IData> = (update: IUpdate<T>) => void;
export type IConvey<T = IData> = IUpdater<T>[];
export type IDraft<T = IData> = (draft: Draft<T>) => T | void;
export type IStatus = {
  type: "IDLE" | "LOADING" | "ERROR" | "SUCCESS";
  message?: IError;
};

export interface IOptions<T = unknown> {
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
  set: (chip: IChip<T>) => void;
}
