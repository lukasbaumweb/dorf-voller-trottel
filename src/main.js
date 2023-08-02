import App from './components/App';
import { GameMenu } from './components/GameMenu';
import { TextMessage } from './components/TextMessage';
import { ONE_MINUTE } from './entities/Helper';
import { World } from './entities/World';
import { AssetLoader } from './lib/AssetLoader';
import { DebugHud } from './lib/DebugHud';

import { Storage } from './lib/Storage';
import { formatString, translate, translateTemplates } from './lib/Translator';
import './style.css';

const startGame = async () => {
  try {
    const debugHud = new DebugHud();

    await new AssetLoader().load();
    const app = new App();
    app.mount();
    const world = new World();

    world.init(app.instance);
    debugHud.init();

    if (window.localStorage.getItem('debug')) {
      debugHud.show();
    }
  } catch (err) {
    console.error(err);
  }
};

const menu = new GameMenu();
menu.onStartNewGame = async () => {
  Storage.clearData();
  Storage.set(Storage.STORAGE_KEYS.username, document.getElementById('username').value);
  await startGame();
};
menu.onLoadGame = async () => {
  await startGame();
  const savedUpdateOn = Storage.get(Storage.STORAGE_KEYS.updatedOn, false);

  if (savedUpdateOn || new Date().getTime() - new Date(savedUpdateOn).getTime() > ONE_MINUTE) {
    new TextMessage({
      text: Storage.get(Storage.STORAGE_KEYS.welcomeMessage, {
        message: formatString(translate('ui.firstGreet'), Storage.get(Storage.STORAGE_KEYS.username, 'Spieler'))
      }).message
    }).init();
    Storage.set(Storage.STORAGE_KEYS.welcomeMessage, {
      message: formatString(translate('ui.greet'), Storage.get(Storage.STORAGE_KEYS.username, 'Spieler'))
    });
  }
};
translateTemplates();

menu.init();

// new Keyboard('Escape', () => {
//   menu.toggle();
// });
