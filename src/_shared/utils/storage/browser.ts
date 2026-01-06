const win = typeof window !== 'undefined' ? window : ({} as Window);

export const localStorage: Storage | undefined = win.localStorage;
export const sessionStorage: Storage | undefined = win.sessionStorage;

