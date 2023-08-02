import App from './components/App';
import { GameMenu } from './components/GameMenu';
import { TextMessage } from './components/TextMessage';
import { ONE_MINUTE } from './entities/Helper';
import { World } from './entities/World';
import { getCurrentLevel } from './gameState';
import { loadLevel } from './lib/AssetLoader';
import { DebugHud } from './lib/DebugHud';

import { clearStoredValue, setStoredValue, STORAGE_KEYS, getStoredValue } from './lib/Storage';
import { formatString, translate, translateTemplates } from './lib/Translator';
import './style.css';

const startGame = async () => {
  try {
    const debugHud = new DebugHud();

    await loadLevel(getCurrentLevel());
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
  clearStoredValue();
  setStoredValue(STORAGE_KEYS.username, document.getElementById('username').value);
  await startGame();
};
menu.onLoadGame = async () => {
  await startGame();
  const savedUpdateOn = getStoredValue(STORAGE_KEYS.updatedOn, false);

  if (savedUpdateOn && new Date().getTime() - new Date(savedUpdateOn).getTime() > ONE_MINUTE) {
    const message = getStoredValue(
      STORAGE_KEYS.welcomeMessage,
      formatString(translate('firstGreet'), getStoredValue(STORAGE_KEYS.username, 'Spieler'))
    );
    new TextMessage({
      text: message
    }).init();
    setStoredValue(
      STORAGE_KEYS.welcomeMessage,
      formatString(translate('greet'), getStoredValue(STORAGE_KEYS.username, 'Spieler'))
    );
  }
};
translateTemplates();

menu.init();

// new Keyboard('Escape', () => {
//   menu.toggle();
// });
