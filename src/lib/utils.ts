import produce from "immer";
import * as TS from "./types";

export function newChip<T = TS.IData>(data?: T): TS.IChip<T> {
  return { data, status: { type: "IDLE" } };
}

export function inequalityCheck<T = TS.IChip<TS.IData>>(chop: T, chip: T) {
  return JSON.stringify(chop) !== JSON.stringify(chip);
}

export function chopper<T = TS.IData>(
  key: string,
  chop: TS.IChip<T>,
  update: TS.ISet
) {
  let updated;
  const isFunction = typeof update === "function";
  if (isFunction) updated = produce(chop.data, update as TS.IDraft);
  else updated = produce(chop.data, () => update);
  return { ...chop, data: updated, key } as TS.IChip<T>;
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
  async function runAsync(): Promise<T | Error | undefined> {
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
  function finishAsync(resp: T | undefined) {
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
