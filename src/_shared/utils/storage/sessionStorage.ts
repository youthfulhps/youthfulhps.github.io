import _ from 'lodash';

import { setValueTo, getValueFrom } from './core';
import { sessionStorage } from './browser';

export const setValueToSessionStorage = _.partial(setValueTo, sessionStorage) as <T = unknown>(
  key: string,
  data: T
) => void;
export const getValueFromSessionStorage = _.partial(getValueFrom, sessionStorage) as <T = unknown>(
  key: string
) => T | undefined;

