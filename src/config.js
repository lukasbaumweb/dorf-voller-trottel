import { Assets } from "pixi.js";

export const CONFIG = {
  PIXEL_SIZE: 16,
  animationFrameLimit: 6,
  OFFSET: { x: 10.5, y: 6 },
  assets: {
    textures: {
      hero: {
        img: "public/textures/characters/hero.png",
        config: "public/textures/characters/hero.json",
      },
      dorf: { img: "public/textures/maps/dorf.png" },
    },
    maps: {
      dorf: "public/maps/dorf.json",
    },
  },
};

const REL_PATH = "..";

const getJSON = () => {
  return Object.values(CONFIG.assets.textures)
    .filter(({ config }) => !!config)
    .map(({ config }) => getAsset(config));
};

const getImages = () => {
  return Object.values(CONFIG.assets.textures).map(({ img }) => getAsset(img));
};

export const getAsset = (path) =>
  `${window.location.origin}/${REL_PATH}/${path}`;
const getMaps = () => {
  return Object.values(CONFIG.assets.maps).map((path) => getAsset(path));
};

export const assetLoader = async () => {
  const jsons = getJSON();
  const images = getImages();
  const maps = getMaps();
  await Assets.load([...jsons, ...images, ...maps]);
};
