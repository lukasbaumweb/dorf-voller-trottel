import { Storage } from '../lib/Storage';

const defaultFunc = () => {
  alert('Not Implemented');
};
const HOURS = 60 * 1000 * 60;
export class GameMenu {
  #onLoadGameFunc = defaultFunc;
  #onStartNewGameFunc = defaultFunc;
  visible = true;

  set onLoadGame(value) {
    this.#onLoadGameFunc = value;
  }

  set onStartNewGame(value) {
    this.#onStartNewGameFunc = value;
  }

  init() {
    document.getElementById('newGame').addEventListener('click', () => {
      this.hide();
      this.#onStartNewGameFunc();
    });

    document.getElementById('loadlastGame').addEventListener('click', () => {
      this.hide();
      this.#onLoadGameFunc();
    });

    if (this.savedGameExists()) {
      const timestampLastGame = new Date(Storage.get(Storage.STORAGE_KEYS.updatedOn));
      document.getElementById('lastGame').style.display = 'flex';
      document.getElementById('lastGameTimestamp').innerText =
        'Letztes Spiel am: ' + timestampLastGame.toLocaleString();
      if (new Date().getTime() - timestampLastGame.getTime() < HOURS) {
        this.hide();
        this.#onLoadGameFunc();
      }
    }
  }

  savedGameExists() {
    return Storage.get(Storage.STORAGE_KEYS.updatedOn, { result: false }).result !== false;
  }

  hide() {
    document.getElementById('gameMenu').classList.add('hide');
    document.getElementById('gameMenuWrapper').classList.remove('game-menu-init');
    setTimeout(() => {
      document.getElementById('gameMenu').style.display = 'none';
    }, 301);
    this.visible = false;
  }

  show() {
    document.getElementById('gameMenu').classList.remove('hide');
    document.getElementById('gameMenuWrapper').classList.add('game-menu-init');
    setTimeout(() => {
      document.getElementById('gameMenu').style.display = 'block';
    }, 301);
    this.visible = true;
  }

  toggle() {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }
}
