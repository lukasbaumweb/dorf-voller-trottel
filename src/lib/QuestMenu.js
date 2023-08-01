import { Keyboard } from '../components/Keyboard';
import { wait } from '../utils';

export class QuestMenu {
  constructor({ progress, onComplete }) {
    this.progress = progress;
    this.onComplete = onComplete;
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('PauseMenu');
    this.element.classList.add('overlayMenu');
    this.element.innerHTML = `
        <h2>Pause Menu</h2>
      `;
  }

  close() {
    this.esc?.unbind();
    this.keyboardMenu.end();
    this.element.remove();
    this.onComplete();
  }

  async init(container) {
    this.createElement();
    this.keyboardMenu = new Keyboard({
      descriptionContainer: container
    });
    this.keyboardMenu.init(this.element);
    this.keyboardMenu.setOptions(this.getOptions('root'));

    container.appendChild(this.element);

    wait(200);
    this.esc = new Keyboard('Escape', () => {
      this.close();
    });
  }
}
