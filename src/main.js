import { World } from './entities/World';
import { AssetLoader } from './lib/AssetLoader';
import { Hud } from './lib/Hud';
import './style.css';

window.world = new World();
window.hud = new Hud();

const assetLoader = new AssetLoader();
assetLoader
  .init()
  .then(() => {
    window.world.init();
    window.hud.init();
    window.hud.show();
  })
  .catch((err) => console.error(err));
