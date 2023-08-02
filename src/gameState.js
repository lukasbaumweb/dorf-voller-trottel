import { STORAGE_KEYS, getStoredValue, setStoredValue } from './lib/Storage';

export const setCurrentLevel = (value) => {
  setStoredValue(STORAGE_KEYS.level, value);
};

export const getCurrentLevel = () => {
  return getStoredValue(STORAGE_KEYS.level, 'dorf');
};
