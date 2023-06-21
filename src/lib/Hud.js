import { CONFIG } from '../config';

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

export class Hud {
  hudContainer = null;
  elements = {};
  constructor() {}

  init() {
    if (window._hud === undefined) {
      this.hudContainer = document.createElement('div');
      this.hudContainer.classList.add('hudContainer');
      this.hudContainer.classList.add('terminal-card');

      this.hudContainer.innerHTML = `
        <h5 class="terminal-prompt">Hud</h5> 
        <div>
        <label for="game-scale">
          Scale: 
          <select id="game-scale" value="${CONFIG.GAME_CONFIG.scale}">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="3.5" selected>3.5</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </label>
        </div>`;
      window._hud = this;

      document.body.appendChild(this.hudContainer);
      document.getElementById('game-scale').onchange = (e) => {
        window.world.DOMGameContainer.style.transform = `scale(${e.target.value}) translateY(50%)`;
      };
    }
    if (window._hud !== undefined) {
      this.hudContainer = window._hud.hudContainer;
      this.elements = window._hud.elements;
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
