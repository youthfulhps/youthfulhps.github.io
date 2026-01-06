import {
  setValueToSessionStorage,
  getValueFromSessionStorage,
} from './sessionStorage';
import {
  setValueToLocalStorage,
  getValueFromLocalStorage,
} from './localStorage';

const SESSION_STORAGE_KEY = '__felog_session_storage_key__';
const LOCAL_STORAGE_KEY = '__felog_local_storage_key__';

export function getCount(defaultValue: number): number {
  return (
    getValueFromSessionStorage<number>(`${SESSION_STORAGE_KEY}/count`) ||
    defaultValue
  );
}

export function setCount(val: number): void {
  setValueToSessionStorage(`${SESSION_STORAGE_KEY}/count`, val);
}

export function getData<T = unknown>(): T | undefined {
  return getValueFromLocalStorage<T>(LOCAL_STORAGE_KEY);
}

export function setData<T = unknown>(val: T): void {
  setValueToLocalStorage(LOCAL_STORAGE_KEY, val);
}

export function getTheme(defaultValue: boolean): boolean {
  const value = getValueFromLocalStorage<boolean>(`${LOCAL_STORAGE_KEY}/theme`);
  if (value === undefined || value === null) {
    return defaultValue;
  }
  return value;
}

export function setTheme(val: boolean): void {
  setValueToLocalStorage(`${LOCAL_STORAGE_KEY}/theme`, val);
}
