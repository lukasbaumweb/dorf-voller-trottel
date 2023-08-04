import { CONFIG, STORY_FLAGS } from './config';
import { STORAGE_KEYS, getStoredValue, setStoredValue, updateStoredValue } from './lib/Storage';

export const setCurrentMap = (value) => {
  setStoredValue(STORAGE_KEYS.map, value);
};

export const getCurrentMap = () => {
  return getStoredValue(STORAGE_KEYS.map, CONFIG.maps.dorf.id);
};

export const getPlayerState = () => {
  return getStoredValue(STORAGE_KEYS.playerStoryProgress, STORY_FLAGS);
};

export const setPlayerState = (key, value) => {
  updateStoredValue(STORAGE_KEYS.playerStoryProgress, { [key]: value });
};
