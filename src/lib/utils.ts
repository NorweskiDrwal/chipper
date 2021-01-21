/* eslint-disable */

import produce from "immer";
import { IChip, IData } from ".";

export function newChip<T = IData>(data: T) {
  return { data, status: { type: "IDLE" } } as IChip;
}

export function equalityCheck(chop: any, chip: any) {
  const isObject = (v: IData) => typeof v === "object";
  const chopDataKs = isObject(chop.data) && Object.keys(chop.data)
  const chipDataKs = isObject(chip.data) && Object.keys(chip.data)
  const isEqual = (chip: any, chop: any) => JSON.stringify(chop) === JSON.stringify(chip);
  if (isEqual(chopDataKs, chipDataKs)) {
    if (isEqual(chop, chip)) return 'skip';
    else return 'update';
  } else return 'warn';
}

export function chopper(key: string, chop, update) {
  let updated;
  const isFunction = typeof update === "function";
  if (isFunction) updated = produce(chop.data, update);
  else updated = produce(chop.data, () => update);
  return { ...chop, data: updated, key };
}

export function mockAsync(data, timeout?: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data !== undefined) resolve(data);
      else reject({ message: "ChipperError: .mockAsync() failed" });
    }, timeout || 0);
  });
}

export async function makeAsync(
  key: string,
  Query,
  async,
  options
) {
  function setStatus(type: any, message?: any) {
    const chip = { ...Query.get(), status: { type, message }, key };
    Query.set(chip);
  }
  function initAsync() {
    setStatus("LOADING");
    return options?.onInit && options.onInit();
  }
  async function runAsync() {
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
  function finishAsync(resp) {
    const data = options?.wrapResp ? options.wrapResp(resp) : resp;
    const chip = { data, status: { type: "SUCCESS" }, key };
    Query.set(chip);
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
