import { Assets } from 'pixi.js';
import { CONFIG } from '../config';

export class AssetLoader {
  relativePath = ''; // "../..";

  getConfigs = () => {
    return Object.values(CONFIG.textures)
      .filter(({ config }) => !!config)
      .map((obj) => {
        if (obj.config) return this.getAsset(obj.config);
        else {
          console.debug(`No config for ${JSON.stringify(obj)}`);
        }
        return false;
      })
      .filter((a) => a !== false);
  };

  getImages = () => {
    return Object.values(CONFIG.textures)
      .map((obj) => {
        if (obj.img) return this.getAsset(obj.img);
        else {
          console.debug(`No img for ${JSON.stringify(obj)}`);
        }
        return false;
      })
      .filter((a) => a !== false);
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

  load = () => {
    console.groupCollapsed('Assets');

    const configs = this.getConfigs();
    const images = this.getImages();
    const maps = this.getMaps();

    const assets = [...configs, ...images, ...maps];

    assets.forEach((a) => {
      console.debug(`Loading asset: ${a}`);
    });
    console.groupEnd();
    return Assets.load(assets);
  };
}
