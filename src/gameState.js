import { CONFIG } from './config';
window._currentLevel = CONFIG.levels.dorf;

export const setCurrentLevel = (value) => {
  window._currentLevel = value;
};
export const getCurrentLevel = () => {
  return window._currentLevel;
};
