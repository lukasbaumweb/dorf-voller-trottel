import { ALPHA_MODES, Assets, TilingSprite } from "pixi.js";
import { CONFIG, getAsset } from "../config";
import { asGridCoord, withGrid } from "../utils";

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

  let flipped_horizontally = gid & FLIPPED_HORIZONTALLY_FLAG;
  let flipped_vertically = gid & FLIPPED_VERTICALLY_FLAG;
  let flipped_diagonally = gid & FLIPPED_DIAGONALLY_FLAG;
  let rotated_hex120 = gid & ROTATED_HEXAGONAL_120_FLAG;

  gid &= ~(FLIPPED_HORIZONTALLY_FLAG | FLIPPED_VERTICALLY_FLAG | FLIPPED_DIAGONALLY_FLAG | ROTATED_HEXAGONAL_120_FLAG);
  console.debug({ gid, flipped_horizontally, flipped_vertically, flipped_diagonally, rotated_hex120 });

  let settings = {};
  if (flipped_horizontally === 0) {
    settings = {
      rotation: -1.5708,
      anchor: {
        x: 1,
        y: 0,
      },
    };
  }
  // console.log(settings);

  return { gid, settings };
};

const loadGround = (pathToMap) => {
  const cached = Assets.get(getAsset(pathToMap));
  console.log(cached);
  const layerIndex = 0;

  const twoDmap = convertTo2D([...cached.layers[layerIndex].data], cached.layers[layerIndex].width);

  const ground = {
    name: cached.layers[layerIndex].name,
    tiles: [],
  };

  for (let y = 0; y < twoDmap.length; y++) {
    for (let x = 0; x < twoDmap[y].length; x++) {
      const texture = (twoDmap[y][x] - 1).toString().padStart(3, 0);
      ground.tiles.push({});
      ground.tiles[ground.tiles.length - 1].sprite = TilingSprite.from(texture, {
        width: CONFIG.PIXEL_SIZE,
        height: CONFIG.PIXEL_SIZE,
        clampMargin: 1,
      });
      ground.tiles[ground.tiles.length - 1].sprite.clampMargin = -0.5;
      ground.tiles[ground.tiles.length - 1].sprite.zIndex = layerIndex;
      ground.tiles[ground.tiles.length - 1].x = x;
      ground.tiles[ground.tiles.length - 1].y = y;
    }
  }

  return ground;
};

const loadWalls = (pathToMap) => {
  const cached = Assets.get(getAsset(pathToMap));

  const accessibleNumber = 290 - 1;
  const inAccessibleNumber = 289 - 1;

  const layerIndex = cached.layers.findIndex((l) => l.name === "accessible");

  const walls = {
    name: cached.layers[layerIndex].name,
    tiles: {},
  };

  const twoDmap = convertTo2D([...cached.layers[layerIndex].data], cached.layers[layerIndex].width);

  let c = 0;

  for (let y = 0; y < twoDmap.length; y++) {
    for (let x = 0; x < twoDmap[y].length; x++) {
      const element = twoDmap[y][x] - 1;
      if (element === accessibleNumber) continue;
      walls.tiles[asGridCoord(x - CONFIG.OFFSET.x * 2 + 1, y - CONFIG.OFFSET.y * 2 + 1)] =
        element === inAccessibleNumber;
      c++;
    }
  }

  return walls;
};

const loadOtherLayers = (pathToMap) => {
  const cached = Assets.get(getAsset(pathToMap));

  const layerRange = [1, 5];

  const layers = [];
  for (let i = layerRange[0]; i < layerRange[1]; i++) {
    const twoDmap = convertTo2D([...cached.layers[i].data], cached.layers[i].width);
    layers.push({});
    layers[i - 1] = {
      name: cached.layers[i].name,
      tiles: [],
    };

    for (let y = 0; y < twoDmap.length; y++) {
      for (let x = 0; x < twoDmap[y].length; x++) {
        let texture = (Number(twoDmap[y][x]) - 1).toString();
        let resolvedGid = {};
        if (texture === "-1") continue;
        if (texture > 10000) {
          resolvedGid = resolveGid(texture);
          texture = resolvedGid.gid;
        }

        texture = (texture + "").padStart(3, 0);

        layers[i - 1].tiles.push({});
        layers[i - 1].tiles[layers[i - 1].tiles.length - 1].sprite = TilingSprite.from(texture, {
          width: CONFIG.PIXEL_SIZE,
          height: CONFIG.PIXEL_SIZE,
          clampMargin: 1,
        });

        if (resolvedGid.settings !== undefined && Object.keys(resolvedGid.settings).length > 0) {
          // console.log(resolvedGid.settings);

          Object.entries(resolvedGid.settings).forEach(([key, value]) => {
            layers[i - 1].tiles[layers[i - 1].tiles.length - 1].sprite[key] = value;
            // console.log(key, value);
          });
        }
        layers[i - 1].tiles[layers[i - 1].tiles.length - 1].sprite.zIndex = i;
        layers[i - 1].tiles[layers[i - 1].tiles.length - 1].x = x;
        layers[i - 1].tiles[layers[i - 1].tiles.length - 1].y = y;
      }
    }
  }
  return layers;
};

const loadLayers = (map) => {
  return [loadGround(map), ...loadOtherLayers(map)];
};

export { loadLayers, loadWalls };
