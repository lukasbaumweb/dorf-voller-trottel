import { ONE_HOUR } from '../entities/Helper';
import { Storage } from '../lib/Storage';

const defaultFunc = () => {
  window.alert('Not Implemented');
};
export class GameMenu {
  #onLoadGameFunc = defaultFunc;
  #onStartNewGameFunc = defaultFunc;
  visible = true;

  /**
   * @param {() => void} value
   */
  set onLoadGame(value) {
    this.#onLoadGameFunc = value;
  }

  get onLoadGame() {}

  /**
   * @param {() => void} value
   */
  set onStartNewGame(value) {
    this.#onStartNewGameFunc = value;
  }

  get onStartNewGame() {}

  init() {
    document.getElementById('createNewGameForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.hide();
      this.#onStartNewGameFunc();
    });

    document.getElementById('loadlastGame').addEventListener('click', () => {
      this.hide();
      this.#onLoadGameFunc();
    });

    if (this.savedGameExists()) {
      const timestampLastGame = new Date(parseInt(Storage.get(Storage.STORAGE_KEYS.updatedOn)));
      document.getElementById('lastGame').style.display = 'flex';
      document.getElementById('lastGameTimestamp').innerText =
        'Letztes Spiel am: ' + timestampLastGame.toLocaleString();
      if (new Date().getTime() - timestampLastGame.getTime() < ONE_HOUR) {
        this.hide();
        this.#onLoadGameFunc();
      }
    }
  }

  savedGameExists() {
    return Storage.get(Storage.STORAGE_KEYS.updatedOn, false) !== false;
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
