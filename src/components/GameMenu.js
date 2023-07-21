import { Storage } from '../lib/Storage';

const defaultFunc = () => {
  alert('Not Implemented');
};

export class GameMenu {
  #onLoadGameFunc = defaultFunc;
  #onStartNewGameFunc = defaultFunc;
  constructor() {}

  set onLoadGame(value) {
    this.#onLoadGameFunc = value;
  }

  set onStartNewGame(value) {
    this.#onStartNewGameFunc = value;
  }

  init() {
    document.getElementById('newGame').addEventListener('click', () => {
      this.close();
      this.#onStartNewGameFunc();
    });

    document.getElementById('loadlastGame').addEventListener('click', () => {
      this.close();
      this.#onLoadGameFunc();
    });

    if (this.savedGameExists()) {
      document.getElementById('lastGame').style.display = 'flex';
      document.getElementById('lastGameTimestamp').innerText =
        'Letztes Spiel am: ' + new Date(Storage.get(Storage.STORAGE_KEYS.updatedOn)).toLocaleString();
    }
  }

  savedGameExists() {
    return Storage.get(Storage.STORAGE_KEYS.updatedOn, { result: false }).result !== false;
  }

  close() {
    document.getElementById('gameMenu').classList.add('hide');
    setTimeout(() => {
      document.getElementById('gameMenu').style.display = 'none';
    }, 301);
  }

  destroy() {}
}
