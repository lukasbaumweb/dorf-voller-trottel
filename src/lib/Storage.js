import { isNullOrUndefined } from '../utils';

/**
 * @enum {string} Storage Keys
 */
const STORAGE_KEYS = {
  language: 'language',
  map: 'map',
  player: 'player',
  gameScale: 'gameScale',
  welcomeMessage: 'welcomeMessage',
  npc: 'npc',
  updatedOn: 'updatedOn',
  playerStoryProgress: 'playerStoryProgress',
  username: 'username',
  'search-image-state': 'search-image-state'
};

/**
 * Retrieves value from local storage (localStorage)
 * @param {STORAGE_KEYS} key unique key of storage
 * @param {object} defaultValue to be returned when nothing is stored in storage
 * @returns value of storage based of given key or defaultvalue
 */
const getStoredValue = (key, defaultValue) => {
  if (!('localStorage' in window)) {
    console.warn('No localstorage found');
    return;
  }
  if (STORAGE_KEYS[key]) {
    const value = window.localStorage.getItem(key);
    const isObj = value?.charAt(0) === '{';

    return isNullOrUndefined(value) ? defaultValue : isObj ? JSON.parse(value) : value;
  } else throw new Error(`Storage key is not valid: ${key}`);
};

/**
/**
 * Saves given value behind given key in local storage (localStorage)
 * @param {STORAGE_KEYS} key unique key of storage place where value should be stored
 * @param {object} value to be stored behind given key
 * @param {boolean} silent if true updateOn timestamp won't be updated
 * @returns value of stored object
 */

const setStoredValue = (key, value, silent) => {
  if (!('localStorage' in window)) {
    console.warn('No localstorage found, Cannot save data');
    return;
  }
  console.debug(`Saving value: ${JSON.stringify(value)} at ${key}`);
  const isObj = typeof value === 'object' && !Array.isArray(value) && value !== null;

  if (isObj) {
    window.localStorage.setItem(key, JSON.stringify(value));
  } else {
    window.localStorage.setItem(key, value);
  }
  !silent && window.localStorage.setItem(STORAGE_KEYS.updatedOn, new Date().getTime());
};

/**
 * Updates given value behind given key in local storage (localStorage)
 * @param {STORAGE_KEYS} key unique key of storage place where value should be updated
 * @param {object} value to be stored behind given key
 */
const updateStoredValue = (key, value) => {
  if (!('localStorage' in window)) {
    console.warn('No localstorage found, Cannot save data');
    return;
  }
  const isObj = typeof value === 'object' && !Array.isArray(value) && value !== null;

  if (isObj) {
    const old = window.localStorage.getItem(key);
    if (old) {
      window.localStorage.setItem(key, JSON.stringify(Object.assign(JSON.parse(old), value)));
    } else {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
    window.localStorage.setItem(STORAGE_KEYS.updatedOn, new Date().getTime());
  } else throw new Error('Value must be object');
};

/**
 * Removes value from local storage (localStorage)
 * @param {string} key key where value is stored
 */
const removeStoredValue = (key) => {
  if (!('localStorage' in window)) {
    console.warn('No localstorage found, Cannot save data');
    return;
  }
  console.debug(`Removing value at ${key}`);

  window.localStorage.removeItem(key);
};

/**
 * Removes every key and its correspondig value from local storage (localStorage)
 */
const clearStoredValue = () => {
  if (!('localStorage' in window)) {
    console.warn('No localstorage found, Cannot save data');
    return;
  }

  Object.keys(STORAGE_KEYS).forEach((key) => {
    window.localStorage.removeItem(key);
  });
};

export { getStoredValue, setStoredValue, updateStoredValue, clearStoredValue, removeStoredValue, STORAGE_KEYS };
