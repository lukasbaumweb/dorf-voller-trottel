const GLOBAL_KEY = '_language';

export class Translator {
  static languages = {
    de_DE: {
      homeMarker: 'Büro',
      townhallMarker: 'Rathaus',
      hero: 'Spieler',
      'old-man': 'Alter Mann'
    }
  };

  static translate(key) {
    if (!window[GLOBAL_KEY]) {
      window[GLOBAL_KEY] = 'de_DE';
    }
    return this.languages[window[GLOBAL_KEY]][key] || key;
  }
}
