import App from './components/App';
import { TextMessage } from './components/TextMessage';
import { World } from './entities/World';
import { AssetLoader } from './lib/AssetLoader';
import { DebugHud } from './lib/DebugHud';

import { Storage } from './lib/Storage';
import './style.css';

const debugHud = new DebugHud();

new AssetLoader()
  .load()
  .then(() => {
    const app = new App();

    const world = new World();
    world.init();
    debugHud.init();

    if (localStorage.getItem('debug')) {
      debugHud.show();
    }

    new TextMessage({
      text: Storage.get(Storage.STORAGE_KEYS.welcomeMessage, {
        message: 'Hallo Spieler, willkommen im Dorf voller Drottel! '
      }).message
    }).init();

    Storage.set(Storage.STORAGE_KEYS.welcomeMessage, { message: 'Hallo Spieler, willkommen zurück!' });
  })
  .catch((err) => console.error(err));
