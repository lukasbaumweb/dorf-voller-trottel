import { CONFIG, getAsset } from "../config";
import { asGridCoord, withGrid } from "../utils";

export const demoLevel = {
  id: "DemoRoom",
  map: CONFIG.assets.maps.dorf.config,
  configObjects: {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      x: withGrid(CONFIG.OFFSET.x - 13),
      y: withGrid(CONFIG.OFFSET.y + 2),
      texture: getAsset(CONFIG.assets.textures.hero.img),
      json: getAsset(CONFIG.assets.textures.hero.config),
      index: 1,
    },
  },
};
