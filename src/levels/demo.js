import { CONFIG, getAsset } from "../config";
import { asGridCoord, withGrid } from "../utils";

export const demoLevel = {
  id: "DemoRoom",
  map: CONFIG.assets.maps.dorf,
  configObjects: {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      x: withGrid(0),
      y: withGrid(0),
      texture: getAsset(CONFIG.assets.textures.hero.img),
      json: getAsset(CONFIG.assets.textures.hero.config),
    },
  },
  walls: {
    // [asGridCoord(7, 6)]: true,
    // [asGridCoord(8, 6)]: true,
    // [asGridCoord(7, 7)]: true,
    // [asGridCoord(8, 7)]: true,
    [asGridCoord(6, 5)]: true,
    [asGridCoord(6, 4)]: true,
    [asGridCoord(6, 3)]: true,
    [asGridCoord(6, 2)]: true,
  },
  floor: { "0,0": { accessible: true, tileId: 0 } },
};
