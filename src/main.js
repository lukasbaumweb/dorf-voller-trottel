import App from './components/App';
import { GameMenu } from './components/GameMenu';
import { Keyboard } from './components/Keyboard';
import { TextMessage } from './components/TextMessage';
import { ONE_MINUTE } from './entities/Helper';
import { World } from './entities/World';
import { AssetLoader } from './lib/AssetLoader';
import { DebugHud } from './lib/DebugHud';

import { Storage } from './lib/Storage';
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
        message: `Hallo ${Storage.get(Storage.STORAGE_KEYS.username, 'Spieler')}, willkommen im Dorf voller Drottel! `
      }).message
    }).init();
    Storage.set(Storage.STORAGE_KEYS.welcomeMessage, {
      message: `Hallo ${Storage.get(Storage.STORAGE_KEYS.username, 'Spieler')}, willkommen zurück!`
    });
  }
};

menu.init();

new Keyboard('Escape', () => {
  menu.toggle();
});
