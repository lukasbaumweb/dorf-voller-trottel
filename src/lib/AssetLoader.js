import { Assets } from 'pixi.js';
import { CONFIG } from '../config';

const RELATIVE_PATH = ''; // "../..";

const getAsset = (path) => `${window.location.origin}/${RELATIVE_PATH}${path}`;

const getGlobalTextures = () => {
  const assets = [];
  Object.values(CONFIG.textures).forEach((value) => {
    if (value.texture) assets.push(getAsset(value.texture));
    if (value.config) assets.push(getAsset(value.config));

    if (!value.texture && !value.config) console.debug(`No img for ${JSON.stringify(value)}`);
  });
  return assets.filter((a) => a !== false);
};

const getMap = (level) => {
  const lvl = CONFIG.levels[level].map;
  return [lvl.config, lvl.lowerImagePath, lvl.upperImagePath].map((p) => getAsset(p));
};

const getItems = (level) => {
  const configObjects = CONFIG.levels[level].configObjects;
  const results = [];
  Object.entries(configObjects)
    .filter(([key, item]) => key !== 'hero')
    .forEach(([key, item]) => {
      if (item.texture) results.push(getAsset(item.texture));
      if (item.config) results.push(getAsset(item.config));
    });

  return results;
};

const loadLevel = (level) => {
  console.groupCollapsed('Assets');

  const globals = getGlobalTextures();
  const maps = getMap(level);
  const items = getItems(level);

  const assets = [...globals, ...maps, ...items];

  assets.forEach((a) => {
    console.debug(`Loading asset: ${a}`);
  });
  console.groupEnd();
  return Assets.load(assets);
};

export { loadLevel, getAsset };
