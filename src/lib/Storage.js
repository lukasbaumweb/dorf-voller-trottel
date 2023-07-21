export class Storage {
  static STORAGE_KEYS = {
    player: 'player',
    gameScale: 'gameScale',
    welcomeMessage: 'welcomeMessage',
    npc: 'npc',
    updatedOn: 'updatedOn'
  };

  static get(key, defaultValue) {
    if (!'localStorage' in window) {
      console.warn('No localstorage found');
      return;
    }
    if (this.STORAGE_KEYS[key]) {
      const value = JSON.parse(localStorage.getItem(key));
      return value === null ? defaultValue : value;
    } else throw new Error(`Storage key is not valid: ${key}`);
  }

  static set(key, value) {
    if (!'localStorage' in window) {
      console.warn('No localstorage found, Cannot save data');
      return;
    }
    const isObj = typeof value === 'object' && !Array.isArray(value) && value !== null;

    if (isObj) {
      localStorage.setItem(key, JSON.stringify(value));
      localStorage.setItem(this.STORAGE_KEYS.updatedOn, new Date().getTime());
    } else throw new Error('Value must be object');
  }

  static clear() {
    if (!'localStorage' in window) {
      console.warn('No localstorage found, Cannot save data');
      return;
    }

    Object.keys(this.STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
}
