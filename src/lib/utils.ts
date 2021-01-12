import produce from "immer";

import * as TS from "./types";

export function newChip<T = TS.IData>(data?: T): TS.IChip<T> {
  return { data, status: { type: "IDLE" } };
}

export function chopper(chop: TS.IChip, update: TS.IUpdate) {
  if (typeof update === "function") {
    const data = produce(chop.data, update as TS.IDraft);
    return newChip(data);
  } else {
    return produce<TS.IChip>(chop, (draft) => ({
      ...draft,
      data: update
    }));
  }
}

export function mockAsync<T = TS.IData>(data: T, timeout?: number) {
  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      if (data !== undefined) resolve(data);
      else reject({ message: "ChipperError: .mockAsync() failed" });
    }, timeout || 0);
  });
}

export async function makeAsync<T = TS.IData>(
  Query: TS.IQuery<T>,
  async: Promise<T | undefined>,
  options?: TS.IOptions
) {
  function setStatus(type: any, message?: any) {
    const chip = { ...Query.get(), status: { type, message } };
    Query.set(chip as TS.IChip<T>);
  }
  function initAsync() {
    setStatus("LOADING");
    return options?.onInit && options.onInit();
  }
  async function runAsync(): Promise<T | Error> {
    try {
      return await async;
    } catch (error) {
      return error;
    }
  }
  function failAsync(message: string) {
    setStatus("ERROR", message);
    return options?.onError && options.onError(message);
  }
  function finishAsync(resp: T) {
    const data = options?.wrapResp ? options.wrapResp(resp) : resp;
    const chip = { data, status: { type: "SUCCESS" } };
    Query.set(chip as TS.IChip<T>);
    return options?.onSuccess && options.onSuccess(data);
  }

  async function* createAsyncGenerator() {
    yield initAsync();
    const resp = await runAsync();
    yield await resp;
    if (resp instanceof Error) return failAsync(resp.message);
    else return finishAsync(resp);
  }

  const AsyncGenerator = createAsyncGenerator();
  AsyncGenerator.next();
  await AsyncGenerator.next();
  AsyncGenerator.next();
}
