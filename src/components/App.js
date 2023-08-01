import { Application } from 'pixi.js';
import { CONFIG } from '../config';

export class AppHelper {
  static getDOMGamecontainer() {
    return document.getElementById('dvtGameContainer');
  }
}

export default class App {
  _appInstance = null;
  DOMGameContainer = null;
  isMounted = false;

  mount() {
    if (this.isMounted) return;
    this._appInstance = new Application({
      background: '#272d37',
      width: CONFIG.GAME_CONFIG.width,
      height: CONFIG.GAME_CONFIG.height
    });

    this.DOMGameContainer = document.createElement('div');
    this.DOMGameContainer.id = 'dvtGameContainer';
    this.DOMGameContainer.sortableChildren = true;
    this.DOMGameContainer.style.setProperty('--game-width', CONFIG.GAME_CONFIG.width + 'px');
    this.DOMGameContainer.style.setProperty('--game-height', CONFIG.GAME_CONFIG.height + 'px');
    this.DOMGameContainer.classList.add('game-wrapper');
    this.DOMGameContainer.appendChild(this._appInstance.view);
    document.body.appendChild(this.DOMGameContainer);

    this.isMounted = true;
    window._game = {
      isBlocked: false
    };
  }

  get instance() {
    return this._appInstance;
  }
}
