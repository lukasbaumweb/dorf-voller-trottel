import { World } from './entities/World';
import { AssetLoader } from './lib/AssetLoader';
import { Hud } from './lib/Hud';
import './style.css';

const world = new World();
const hud = new Hud();

const assetLoader = new AssetLoader();
assetLoader
  .init()
  .then(() => {
    world.init();
    hud.init();
  })
  .catch((err) => console.error(err));
