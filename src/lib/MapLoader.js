import { Assets, Sprite, Spritesheet, Texture, TilingSprite } from "pixi.js";
import { CONFIG, getAsset } from "../config";

const loadMap = (map) => {
  const cached = Assets.get(getAsset(CONFIG.assets.maps.dorf));

  const layers = cached.layers.map((l) => ({
    name: l.name,
    tiles: [],
  }));

  console.log(cached);
  const newArr = [];
  while (cached.layers[0].data.length)
    newArr.push(cached.layers[0].data.splice(0, cached.layers[0].width));

  const currentLayer = 0;
  let c = 0;

  for (let y = 0; y < newArr.length; y++) {
    for (let x = 0; x < newArr[y].length; x++) {
      const element = (newArr[y][x] - 1).toString().padStart(3, 0);
      layers[currentLayer].tiles[c] = {};
      layers[currentLayer].tiles[c].sprite = TilingSprite.from(
        element,
        CONFIG.PIXEL_SIZE * 2,
        CONFIG.PIXEL_SIZE * 2
      );
      layers[currentLayer].tiles[c].sprite.zIndex = currentLayer;
      layers[currentLayer].tiles[c].sprite.x = x * CONFIG.PIXEL_SIZE;
      layers[currentLayer].tiles[c].sprite.y = y * CONFIG.PIXEL_SIZE;
      layers[currentLayer].tiles[c].x = x;
      layers[currentLayer].tiles[c].y = y;
      c++;
    }
  }

  return layers;
};

export { loadMap };
