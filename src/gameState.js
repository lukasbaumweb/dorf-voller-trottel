import { CONFIG } from './config';
window._currentLevel = CONFIG.levels['old-lady-home'];

export const setCurrentLevel = (value) => {
  window._currentLevel = value;
};
export const getCurrentLevel = () => {
  return window._currentLevel;
};
