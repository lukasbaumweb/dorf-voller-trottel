import { Application, Container } from 'pixi.js';
import { CONFIG } from '../config';

const GLOBAL_KEY = '_app';

export default class App {
  _appInstance = null;
  DOMGameContainer = null;
  isMounted = false;

  constructor() {
    this.getInstance();
  }

  getInstance() {
    if (window[GLOBAL_KEY] === undefined) {
      if (!window[GLOBAL_KEY]) {
        window[GLOBAL_KEY] = this;
      } else {
        let props = Object.getOwnPropertyNames(this);

        for (const prop of props) {
          this[prop] = window[GLOBAL_KEY][prop];
        }
      }
      window[GLOBAL_KEY] = this;
    }
    if (!window[GLOBAL_KEY].isMounted) {
      this.mount();
    }
    return window[GLOBAL_KEY];
  }

  mount() {
    if (this.isMounted) return;
    this._appInstance = new Application({
      background: '#272d37',
      width: CONFIG.GAME_CONFIG.width,
      height: CONFIG.GAME_CONFIG.height
    });

    this.DOMGameContainer = document.createElement('div');
    this.DOMGameContainer.sortableChildren = true;
    this.DOMGameContainer.style.setProperty('--game-width', CONFIG.GAME_CONFIG.width + 'px');
    this.DOMGameContainer.style.setProperty('--game-height', CONFIG.GAME_CONFIG.height + 'px');
    this.DOMGameContainer.classList.add('game-wrapper');
    this.DOMGameContainer.appendChild(this._appInstance.view);
    document.body.appendChild(this.DOMGameContainer);

    this.isMounted = true;
  }
}
