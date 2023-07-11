import App from '../components/App';
import { CONFIG } from '../config';
import { World } from '../entities/World';

import { Storage } from './Storage';

class HudElement {
  htmlElement = null;
  constructor(id) {
    this.id = id;
    this.htmlElement = document.createElement('div');
  }

  setValue(val) {
    console.debug(`settings value ${val}`);

    this.htmlElement.innerHTML = val;
  }
}

const GLOBAL_KEY = '_debugHud';
const scaleOptions = [1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8];
export class DebugHud {
  hudContainer = null;
  elements = {};
  isMounted = false;

  static get shared() {
    if (window[GLOBAL_KEY]) {
      return window[GLOBAL_KEY];
    } else {
      const hud = new DebugHud();
      hud.init();
      return hud;
    }
  }

  constructor() {
    if (!window[GLOBAL_KEY]) {
      window[GLOBAL_KEY] = this;
    } else {
      let props = Object.getOwnPropertyNames(this);

      for (const prop of props) {
        this[prop] = window[GLOBAL_KEY][prop];
      }
    }
  }
  init() {
    this.mount();
  }

  mount() {
    if (!this.isMounted) {
      this.hudContainer = document.createElement('div');
      this.hudContainer.classList.add('hudContainer');
      this.hudContainer.classList.add('terminal-card');

      const currentValue = parseFloat(Storage.get(Storage.STORAGE_KEYS.gameScale)?.scale) || CONFIG.GAME_CONFIG.scale;
      const values = scaleOptions.reduce(
        (acc, cur) => (acc += `<option value="${cur}" ${cur === currentValue ? 'selected' : ''}>${cur}</option>`),
        ''
      );

      this.hudContainer.innerHTML = `
        <h5 class="terminal-prompt">Hud</h5> 
        <div>
        <label for="game-scale">
          Scale: 
          <select id="game-scale" value="${currentValue}">
            ${values}
          </select>
        </label>
        </div>`;
      window[GLOBAL_KEY] = this;

      document.body.appendChild(this.hudContainer);

      const app = new App();
      document.getElementById('game-scale').onchange = (e) => {
        app.getInstance().DOMGameContainer.style.transform = `scale(${e.target.value})`;
        Storage.set(Storage.STORAGE_KEYS.gameScale, { scale: e.target.value });
      };
      app.getInstance().DOMGameContainer.style.transform = `scale(${currentValue})`;
      this.isMounted = true;
    }
  }

  registerElement(id) {
    if (this.elements[id]) throw new Error(`Element with id: ${id} already been registered`);
    console.debug(`Registering Hud element ${id}`);

    this.elements[id] = new HudElement(id);
    this.hudContainer.appendChild(this.elements[id].htmlElement);
  }

  updateElement(id, value) {
    this.elements[id].setValue(value);
  }

  show() {
    this.hudContainer.classList.add('show');
  }

  hide() {
    this.hudContainer.classList.remove('show');
  }

  toggle() {
    this.hudContainer.classList.toggle('show');
  }
}
