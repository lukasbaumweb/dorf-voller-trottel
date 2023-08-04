import { STORAGE_KEYS, getStoredValue, setStoredValue } from './Storage';

/**
 * Enum for Days of the Week
 * @enum {string}
 */
const LanguageCode = {
  de_DE: 'de_DE'
};

const languages = {
  de_DE: {
    ui: {
      title: 'Dorf voller Trottel',
      description:
        'Rette dein Dorf vor Hackern durch das Verbessern der IT-Sicherheitskenntnisse deiner Dorfkollegen. Du bist dabei der neu hinzugezogene IT-Sicherheitsexperte. Löse alle Aufgaben oder verlasse das Dorf voller Trottel!',
      username: 'Nutzername'
    },
    home: 'Büro',
    'small house': 'Haus der alten Dame',
    'large house': 'Haus des Bürgermeisters',
    townhall: 'Rathaus',
    hero: 'IT-Sicherheitsberater {0}',
    'old-man': 'Bürgermeister Fred',
    firstGreet: 'Hallo {0}, willkommen im Dorf voller Drottel!',
    greet: 'Hallo {0}, willkommen zurück!',
    calendar: 'Kalender',
    'sniffing blanket': 'Schnüffeldecke',
    'leave building': 'Gebäude verlassen',
    leave: 'Verlassen',
    enter: 'Betreten',
    cancel: 'Abbrechen',
    accept: 'Ok',
    ignore: 'Ignorieren',
    examine: 'Ansehen'
  }
};

/**
 * Retrieves translation of given key
 * @param {string} key of translation to be retrieved
 * @returns translation of given key
 */
const translate = (key) => {
  const currentLanguage = getStoredValue(STORAGE_KEYS.language, LanguageCode.de_DE);
  return languages[currentLanguage][key] || key;
};

/**
 * Setting language of Translator globally
 * @param {LanguageCode} langCode code of language
 */
const setLanguage = (langCode) => {
  if (!languages[langCode]) throw Error('Language code is undefined');
  setStoredValue(STORAGE_KEYS.language, langCode);
};

/**
 * Retrieves all translations for current selected language
 * @returns current englisch object with every translation
 */
const getLanguage = () => {
  return languages[getStoredValue(STORAGE_KEYS.language, LanguageCode.de_DE)];
};

/**
 * Translates every html node element which has a translate data attribute specified
 */
const translateTemplates = () => {
  document.querySelectorAll('[data-translate]').forEach((node) => {
    const keys = node.getAttribute('data-translate')?.split('.');
    let value = getLanguage();
    try {
      keys.forEach((key) => {
        value = value[key];
      });
    } catch (err) {
      console.error(err);
    }
    node.innerHTML = typeof value === 'string' ? value : node.getAttribute('data-translate');
  });
};

const formatString = function (target) {
  const args = [...arguments].slice(1);
  return target.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] !== 'undefined' ? args[number] : match;
  });
};

export { translate, setLanguage, translateTemplates, getLanguage, formatString };
