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

      this.hudContainer.innerHTML = `<div><b>Hud</b></div>`;
      window._hud = this;

      document.body.appendChild(this.hudContainer);
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
