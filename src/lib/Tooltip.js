import App from '../components/App';
import { World } from '../entities/World';

const GLOBAL_KEY = '_tooltip';
export class Tooltip {
  isMounted = false;
  tooltipContainer = null;
  timeout = null;

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
      this.tooltipContainer = document.createElement('p');
      this.tooltipContainer.classList.add('tooltip');
      this.tooltipContainer.classList.add('terminal-alert');
      this.tooltipContainer.style.opacity = 0;

      document.body.appendChild(this.tooltipContainer);

      this.isMounted = true;
    }
  }

  showMessage(message) {
    this.tooltipContainer.style.opacity = 1;
    this.tooltipContainer.style.display = 'block';

    this.tooltipContainer.innerText = message;
  }

  hide() {
    this.tooltipContainer.style.opacity = 0;
  }
}
