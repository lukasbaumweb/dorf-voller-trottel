import App from './components/App';
import { GameMenu } from './components/GameMenu';
import { CONFIG } from './config';
import { World } from './entities/World';
import { DebugHud } from './lib/DebugHud';
import { QuestMenu } from './components/QuestMenu';

import { clearStoredValue, setStoredValue, STORAGE_KEYS, getStoredValue } from './lib/Storage';
import { formatString, translate, translateTemplates } from './lib/Translator';
import './style.css';
import { getCurrenTask, runMonolog } from './utils';
import { initialize } from './lib/ExternalScriptRunner';

const startGame = async () => {
  try {
    const debugHud = new DebugHud();

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

const greetUser = () => {
  const savedUpdateOn = getStoredValue(STORAGE_KEYS.updatedOn, false);

  if (savedUpdateOn) {
    const message = getStoredValue(
      STORAGE_KEYS.welcomeMessage,
      formatString(translate('firstGreet'), getStoredValue(STORAGE_KEYS.username, 'Spieler'))
    );
    setStoredValue(
      STORAGE_KEYS.welcomeMessage,
      formatString(translate('greet'), getStoredValue(STORAGE_KEYS.username, 'Spieler'))
    );

    runMonolog([message]);
  } else {
    const message = formatString(translate('firstGreet'), getStoredValue(STORAGE_KEYS.username, 'Spieler'));

    // Get next quest
    const currentTaskId = getCurrenTask();
    const currentQuest = Object.entries(CONFIG.quests).find(([_, quest]) => quest.id === currentTaskId);
    runMonolog([message, currentQuest[1].short]);
  }
};
const questMenu = new QuestMenu();
const menu = new GameMenu();
menu.onStartNewGame = async () => {
  clearStoredValue();
  setStoredValue(STORAGE_KEYS.username, document.getElementById('username').value.trim(), true);
  await startGame();
  greetUser();
  questMenu.init();
};
menu.onLoadGame = async () => {
  await startGame();
  greetUser();
  questMenu.init();
};
translateTemplates();

initialize();
menu.init();

// new Keyboard('Escape', () => {
//   menu.toggle();
// });
