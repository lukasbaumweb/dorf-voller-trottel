import { Modal } from './components/Modal';
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

    const currentQuest = Object.values(CONFIG.quests).find((q) => q.id === detail.flag);
    if (currentQuest) {
      const toastEvt = new window.CustomEvent('showToastMessage', {
        detail: {
          text: `Glückwunsch. Quest abgeschlossen: ${currentQuest.short}`,
          onClick: () => {
            if (currentQuest) {
              const modal = new Modal({
                modalContent: currentQuest.award,
                title: currentQuest.short
              });
              modal.init();
              modal.show();
            }
          }
        }
      });
      document.dispatchEvent(toastEvt);
    }
  });
  window[GLOBAL_KEY] = true;
};

export const checkStoryFlag = (storyFlags) => {
  const currentProgress = getPlayerState();
  return (storyFlags || []).every((storyFlag) => {
    return currentProgress[storyFlag];
  });
};

export const checkDisqualifiedFlags = (storyFlags) => {
  const currentProgress = getPlayerState();
  return !(storyFlags || []).some((storyFlag) => {
    return currentProgress[storyFlag];
  });
};
