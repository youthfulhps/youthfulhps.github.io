import _ from 'lodash';

import { setValueTo, getValueFrom } from './core';
import { localStorage } from './browser';

export const setValueToLocalStorage = _.partial(setValueTo, localStorage) as <T = unknown>(
  key: string,
  data: T
) => void;
export const getValueFromLocalStorage = _.partial(getValueFrom, localStorage) as <T = unknown>(
  key: string
) => T | undefined;

