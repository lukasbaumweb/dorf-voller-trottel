import { CONFIG } from './config';
import { STORAGE_KEYS, getStoredValue } from './lib/Storage';

// TODO: Load Level from storage
window._currentLevel = CONFIG.levels[getStoredValue(STORAGE_KEYS.level, 'dorf')];

export const setCurrentLevel = (value) => {
  window._currentLevel = value;
};
export const getCurrentLevel = () => {
  return window._currentLevel;
};
