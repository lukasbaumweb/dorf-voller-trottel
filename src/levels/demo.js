import { CONFIG, getAsset } from "../config";
import { asGridCoord, withGrid } from "../utils";

export const demoLevel = {
  id: "DemoRoom",
  map: CONFIG.assets.maps.dorf.config,
  configObjects: {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      x: withGrid(-4),
      y: withGrid(-8),
      // x: -withGrid(CONFIG.OFFSET.x) * 2 + CONFIG.PIXEL_SIZE,
      // y: -withGrid(CONFIG.OFFSET.y) * 2 + CONFIG.PIXEL_SIZE,
      texture: getAsset(CONFIG.assets.textures.hero.img),
      json: getAsset(CONFIG.assets.textures.hero.config),
    },
  },
};
