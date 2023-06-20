import { Assets, TilingSprite } from 'pixi.js';
import { CONFIG } from '../config';
import { asGridCoord } from '../utils';
import { AssetLoader } from './AssetLoader';

const convertTo2D = (oneDimensionArr, length) => {
  const newArr = [];
  while (oneDimensionArr.length) newArr.push(oneDimensionArr.splice(0, length));

  return newArr;
};

const resolveGid = (gid) => {
  const FLIPPED_HORIZONTALLY_FLAG = 0x80000000;
  const FLIPPED_VERTICALLY_FLAG = 0x40000000;
  const FLIPPED_DIAGONALLY_FLAG = 0x20000000;
  const ROTATED_HEXAGONAL_120_FLAG = 0x10000000;

  // let flipped_horizontally = gid & FLIPPED_HORIZONTALLY_FLAG;
  // let flipped_vertically = gid & FLIPPED_VERTICALLY_FLAG;
  // let flipped_diagonally = gid & FLIPPED_DIAGONALLY_FLAG;
  // let rotated_hex120 = gid & ROTATED_HEXAGONAL_120_FLAG;

  gid &= ~(FLIPPED_HORIZONTALLY_FLAG | FLIPPED_VERTICALLY_FLAG | FLIPPED_DIAGONALLY_FLAG | ROTATED_HEXAGONAL_120_FLAG);

  return { gid };
};

const loadGround = (pathToMap) => {
  const assetLoader = new AssetLoader();
  const cached = Assets.get(assetLoader.getAsset(pathToMap));
  console.log(cached);
  const layerIndex = 0;

  const twoDmap = convertTo2D([...cached.layers[layerIndex].data], cached.layers[layerIndex].width);

  const ground = {
    name: cached.layers[layerIndex].name,
    tiles: {}
  };

  for (let y = 0; y < twoDmap.length; y++) {
    for (let x = 0; x < twoDmap[y].length; x++) {
      const texture = (twoDmap[y][x] - 1).toString().padStart(3, 0);
      const key = asGridCoord(x, y);
      ground.tiles[key] = {};
      ground.tiles[key].sprite = TilingSprite.from(texture, {
        width: CONFIG.PIXEL_SIZE,
        height: CONFIG.PIXEL_SIZE,
        clampMargin: 1
      });
      ground.tiles[key].sprite.clampMargin = -0.5;
      ground.tiles[key].sprite.zIndex = layerIndex;
      ground.tiles[key].x = x;
      ground.tiles[key].y = y;
    }
  }

  return ground;
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

const loadOtherLayers = (pathToMap) => {
  const assetLoader = new AssetLoader();
  const cached = Assets.get(assetLoader.getAsset(pathToMap));

  const layerRange = [1, cached.layers.length - 1];

  const layers = [];
  for (let i = layerRange[0]; i < layerRange[1]; i++) {
    const currentLayer = i - 1;
    const twoDmap = convertTo2D([...cached.layers[i].data], cached.layers[i].width);
    layers.push({});
    layers[currentLayer] = {
      name: cached.layers[i].name,
      tiles: {}
    };

    for (let y = 0; y < twoDmap.length; y++) {
      for (let x = 0; x < twoDmap[y].length; x++) {
        let texture = (Number(twoDmap[y][x]) - 1).toString();
        let resolvedGid = {};
        if (texture === '-1') continue;
        if (texture > 10000) {
          resolvedGid = resolveGid(texture);
          texture = resolvedGid.gid;
        }

        const key = `${x},${y}`; // asGridCoord(x, y);

        texture = (texture + '').padStart(3, 0);
        layers[currentLayer].tiles[key] = {};
        layers[currentLayer].tiles[key].sprite = TilingSprite.from(texture, {
          width: CONFIG.PIXEL_SIZE,
          height: CONFIG.PIXEL_SIZE,
          clampMargin: 1
        });

        layers[currentLayer].tiles[key].sprite.zIndex = i + 10;
        layers[currentLayer].tiles[key].x = x;
        layers[currentLayer].tiles[key].y = y;
      }
    }
  }
  return layers;
};

const loadLayers = (map) => {
  return [loadGround(map), ...loadOtherLayers(map)];
};

export { loadLayers, loadWalls };
