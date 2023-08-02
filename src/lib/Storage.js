export class Storage {
  static STORAGE_KEYS = {
    language: 'language',
    player: 'player',
    gameScale: 'gameScale',
    welcomeMessage: 'welcomeMessage',
    npc: 'npc',
    updatedOn: 'updatedOn',
    playerStoryProgress: 'playerStoryProgress',
    username: 'username'
  };

  static get(key, defaultValue) {
    if (!('localStorage' in window)) {
      console.warn('No localstorage found');
      return;
    }
    if (this.STORAGE_KEYS[key]) {
      const value = window.localStorage.getItem(key);
      const isObj = value?.charAt(0) === '{';

      return value === null ? defaultValue : isObj ? JSON.parse(value) : value;
    } else throw new Error(`Storage key is not valid: ${key}`);
  }

  static set(key, value) {
    if (!('localStorage' in window)) {
      console.warn('No localstorage found, Cannot save data');
      return;
    }
    const isObj = typeof value === 'object' && !Array.isArray(value) && value !== null;

    if (isObj) {
      window.localStorage.setItem(key, JSON.stringify(value));
    } else {
      window.localStorage.setItem(key, value);
    }
    window.localStorage.setItem(this.STORAGE_KEYS.updatedOn, new Date().getTime());
  }

  static update(key, value) {
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
      window.localStorage.setItem(this.STORAGE_KEYS.updatedOn, new Date().getTime());
    } else throw new Error('Value must be object');
  }

  static clearData() {
    if (!('localStorage' in window)) {
      console.warn('No localstorage found, Cannot save data');
      return;
    }

    Object.keys(this.STORAGE_KEYS).forEach((key) => {
      window.localStorage.removeItem(key);
    });
  }
}
