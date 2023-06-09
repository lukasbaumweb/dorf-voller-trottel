import { Assets, Sprite } from 'pixi.js';
import { CONFIG } from '../config';
import { asGridCoord } from '../utils';
import { AssetLoader } from './AssetLoader';

const convertTo2D = (oneDimensionArr, length) => {
  const newArr = [];
  while (oneDimensionArr.length) newArr.push(oneDimensionArr.splice(0, length));
  return newArr;
};

const loadMaps = (lowerPath, upperPath) => {
  const assetLoader = new AssetLoader();
  const cachedLower = Assets.get(assetLoader.getAsset(lowerPath));
  const cachedUpper = Assets.get(assetLoader.getAsset(upperPath));
  const lower = new Sprite(cachedLower);
  const upper = new Sprite(cachedUpper);
  return { lower, upper };
};

const loadWalls = (pathToMap) => {
  const assetLoader = new AssetLoader();

  const cached = Assets.get(assetLoader.getAsset(pathToMap));

  const accessibleNumber = 290 - 1;
  const inAccessibleNumber = 289 - 1;

  const layerIndex = cached.layers.findIndex((l) => l.name === 'accessible');

  const walls = {
    name: cached.layers[layerIndex].name,
    tiles: {}
  };

  const twoDmap = convertTo2D([...cached.layers[layerIndex].data], cached.layers[layerIndex].width);

  for (let y = 0; y < twoDmap.length; y++) {
    for (let x = 0; x < twoDmap[y].length; x++) {
      const element = twoDmap[y][x] - 1;
      if (element === accessibleNumber) continue;
      walls.tiles[asGridCoord(x, y)] = element === inAccessibleNumber;
    }
  }

  return walls;
};

const loadLayers = (pathToMap) => {
  const assetLoader = new AssetLoader();
  const cached = Assets.get(assetLoader.getAsset(pathToMap));
  const filtered = cached.layers.splice(0, cached.layers.length - 1).map((l, i) => ({ zIndex: i, ...l }));
  console.debug(filtered);
  return filtered;
};
export { loadLayers, loadMaps, loadWalls };
