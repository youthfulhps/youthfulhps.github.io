function isEmpty(storage: Storage | undefined): boolean {
  return !storage || storage === ({} as Storage);
}

export function getValueFrom<T = unknown>(storage: Storage | undefined, key: string): T | undefined {
  if (isEmpty(storage)) {
    return;
  }
  const rawData = storage!.getItem(key);

  if (!rawData) {
    return;
  }
  return JSON.parse(rawData) as T;
}

export function setValueTo<T = unknown>(storage: Storage | undefined, key: string, data: T): void {
  if (isEmpty(storage)) {
    return;
  }
  storage!.setItem(key, JSON.stringify(data));
}

