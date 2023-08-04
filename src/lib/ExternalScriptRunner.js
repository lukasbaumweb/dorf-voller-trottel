import _ from 'lodash';

const GLOBAL_KEY = 'externalScriptRunner';

/**
 * Register external script
 * @param {string} key unique key
 * @param {Function} init to be called to initialize you logic
 */
const registerExternalScript = (key, init) => {
  initialize();
  // Remove Key and script if already in it
  if (key in window[GLOBAL_KEY].keys) {
    window[GLOBAL_KEY].scripts = window[GLOBAL_KEY].scripts.filter((script) => script.key !== key);
  }

  window[GLOBAL_KEY].keys[key] = true;
  window[GLOBAL_KEY].scripts.push({ key, function: init });
};

/**
 *  Runs latest external script from stack
 * @param  {...any} params callback parameter passed to init function of external script
 */
const runExternalScript = (...params) => {
  initialize();
  const lastScript = window[GLOBAL_KEY].scripts.pop();
  const newKeysObj = _.omit(window[GLOBAL_KEY].keys, [lastScript.key]);
  window[GLOBAL_KEY].keys = newKeysObj;
  try {
    lastScript.function(...params);
  } catch (err) {
    console.error(err);
  }
};

export const initialize = () => {
  if (!window[GLOBAL_KEY]?.keys) {
    window[GLOBAL_KEY] = { register: registerExternalScript, keys: {}, scripts: [], call: runExternalScript };
  }
};
