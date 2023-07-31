import { Keyboard } from './Keyboard';

class RevealingText {
  constructor(config) {
    this.element = config.element;
    this.text = config.text;
    this.speed = config.speed || 60;

    this.timeout = null;
    this.isDone = false;
  }

  revealOneCharacter(list) {
    const next = list.splice(0, 1)[0];
    next.span.classList.add('revealed');

    if (list.length > 0) {
      this.timeout = setTimeout(() => {
        this.revealOneCharacter(list);
      }, next.delayAfter);
    } else {
      this.isDone = true;
    }
  }

  warpToDone() {
    clearTimeout(this.timeout);
    this.isDone = true;
    this.element.querySelectorAll('span').forEach((s) => {
      s.classList.add('revealed');
    });
  }

  init() {
    let characters = [];
    this.text.split('').forEach((character) => {
      //Create each span, add to element in DOM
      let span = document.createElement('span');
      span.textContent = character;
      this.element.appendChild(span);

      //Add this span to our internal state Array
      characters.push({
        span,
        delayAfter: character === ' ' ? 0 : this.speed
      });
    });

    this.revealOneCharacter(characters);
  }
}

export class TextMessage {
  constructor({ text, onComplete, onCancel, onAcceptText, onCancelText }) {
    this.text = text;
    this.onComplete = onComplete;
    this.onCancel = onCancel;
    this.cancelBtnText = onCancelText || 'Cancel (Esc)';
    this.acceptBtnText = onAcceptText || 'Ok (Enter)';

    this.element = null;
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('message');

    this.element.innerHTML = `
        <p class="message-content"></p>
        <div class="message-actions">
          ${
            this.onCancel
              ? `<button class="message-action btn btn-error" id="btnCancel">${this.cancelBtnText}</button>`
              : ''
          }
          <button class="message-action btn btn-error" id="btnEnter">${this.acceptBtnText}</button>  
        </div>
      `;

    this.revealingText = new RevealingText({
      element: this.element.querySelector('.message-content'),
      text: this.text
    });

    if (this.onCancel) {
      this.element.querySelector('#btnCancel').addEventListener('click', () => {
        this.onCancel();
        this.done();
      });
      this.actionListener = new Keyboard('Escape', () => {
        this.onCancel();
        this.done();
      });
    }

    this.element.querySelector('#btnEnter').addEventListener('click', () => {
      this.done();
      this.onComplete && this.onComplete();
    });

    this.actionListener = new Keyboard('Enter', () => {
      this.done();
    });
  }

  done() {
    if (this.revealingText.isDone) {
      this.element.remove();
      this.actionListener.unbind();
    } else {
      this.revealingText.warpToDone();
    }
    window._game.isBlocked = false;
  }

  async init() {
    window._game.isBlocked = true;
    this.createElement();
    document.body.appendChild(this.element);

    this.revealingText.init();
  }
}
