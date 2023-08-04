import { CONFIG, STORY_FLAGS } from './config';
import { STORAGE_KEYS, getStoredValue, setStoredValue, updateStoredValue } from './lib/Storage';

const GLOBAL_KEY = 'gameState';

export const setCurrentMap = (value) => {
  setStoredValue(STORAGE_KEYS.map, value);
};

export const getCurrentMap = () => {
  return getStoredValue(STORAGE_KEYS.map, CONFIG.maps.dorf.id);
};

export const getPlayerState = () => {
  initialize();
  return Object.assign(STORY_FLAGS, getStoredValue(STORAGE_KEYS.playerStoryProgress));
};

export const setPlayerState = (key, value) => {
  initialize();
  updateStoredValue(STORAGE_KEYS.playerStoryProgress, { [key]: value });
};

export const initialize = () => {
  if (window[GLOBAL_KEY]) return;

  document.addEventListener('addStoryFlag', ({ detail }) => {
    setPlayerState(detail.flag, true);
    console.debug(`Flag: ${detail.flag}`);
    const evt = new window.CustomEvent('renderQuests');
    document.dispatchEvent(evt);
  });
  window[GLOBAL_KEY] = true;
};

export const checkStoryFlag = (storyFlags = []) => {
  const currentProgress = getPlayerState();
  return (storyFlags || []).every((storyFlag) => {
    return currentProgress[storyFlag];
  });
};

export const checkDisqualifiedFlags = (storyFlags = []) => {
  const currentProgress = getPlayerState();
  console.log(currentProgress, storyFlags);
  return !(storyFlags || []).some((storyFlag) => {
    return currentProgress[storyFlag];
  });
};
