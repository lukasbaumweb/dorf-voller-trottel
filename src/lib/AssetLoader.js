import { Assets } from 'pixi.js';
import { CONFIG } from '../config';

export class AssetLoader {
  relativePath = ''; // "../..";

  getConfigs = () => {
    return Object.values(CONFIG.textures)
      .filter(({ config }) => !!config)
      .map(({ config }) => this.getAsset(config));
  };

  getImages = () => {
    return Object.values(CONFIG.textures).map(({ img }) => this.getAsset(img));
  };

  getAsset = (path) => `${window.location.origin}/${this.relativePath}${path}`;

  getMaps = () => {
    const levelConfigs = Object.values(CONFIG.levels).map(({ map }) => map);
    const maps = [];
    levelConfigs.forEach((c) => {
      Object.values(c).forEach((path) => maps.push(this.getAsset(path)));
    });

    return maps;
  };

  init = () => {
    const configs = this.getConfigs();
    const images = this.getImages();
    const maps = this.getMaps();

    const assets = [...configs, ...images, ...maps];

    console.groupCollapsed('Assets');
    assets.forEach((a) => {
      console.debug(`Loading asset: ${a}`);
    });
    console.groupEnd();
    return Assets.load(assets);
  };
}
