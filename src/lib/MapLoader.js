import { Assets, Sprite } from 'pixi.js';
import { asGridCoord } from '../utils';
import { getAsset } from './AssetLoader';

const convertTo2D = (oneDimensionArr, length) => {
  const newArr = [];
  while (oneDimensionArr.length) newArr.push(oneDimensionArr.splice(0, length));
  return newArr;
};

const loadMapLayers = ({ lowerImagePath, upperImagePath }) => {
  const cachedLower = Assets.get(getAsset(lowerImagePath));
  const cachedUpper = Assets.get(getAsset(upperImagePath));
  const lower = new Sprite(cachedLower);
  const upper = new Sprite(cachedUpper);
  return { lower, upper };
};

const loadWalls = (pathToMap) => {
  const cached = Assets.get(getAsset(pathToMap));
  const layerIndex = cached.layers.findIndex((l) => l.name === 'accessible');

  const accessibleNumber = cached.layers[layerIndex].data[0];
  const inAccessibleNumber = cached.layers[layerIndex].data[0] - 1;

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
  const cached = Assets.get(getAsset(pathToMap));
  const filtered = cached.layers.splice(0, cached.layers.length - 1).map((l, i) => ({ zIndex: i, ...l }));
  return filtered;
};

export { loadLayers, loadMapLayers, loadWalls };
