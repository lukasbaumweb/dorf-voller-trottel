import { STORAGE_KEYS, getStoredValue, setStoredValue, updateStoredValue } from './lib/Storage';

export const setCurrentLevel = (value) => {
  setStoredValue(STORAGE_KEYS.level, value);
};

export const getCurrentLevel = () => {
  return getStoredValue(STORAGE_KEYS.level, 'dorf');
};

export const getPlayerState = () => {
  getStoredValue(STORAGE_KEYS.playerStoryProgress);
};

export const setPlayerState = (key, value) => {
  updateStoredValue(STORAGE_KEYS.playerStoryProgress, { key: value });
};
