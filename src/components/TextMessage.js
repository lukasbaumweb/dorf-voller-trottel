import { World } from '../entities/World';
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
  constructor({ text, onComplete }) {
    this.text = text;
    this.onComplete = onComplete;
    this.element = null;
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('message');

    this.element.innerHTML = `
        <p class="message-content"></p>
        <button class="message-action btn btn-error">Enter</button>
      `;

    //Init the typewriter effect
    this.revealingText = new RevealingText({
      element: this.element.querySelector('.message-content'),
      text: this.text
    });

    this.element.querySelector('button').addEventListener('click', () => {
      //Close the text message
      this.done();
    });

    this.actionListener = new Keyboard('Enter', () => {
      this.done();
    });
  }

  done() {
    if (this.revealingText.isDone) {
      this.element.remove();
      this.actionListener.unbind();
      this.onComplete && this.onComplete();
    } else {
      this.revealingText.warpToDone();
    }
  }

  init() {
    this.createElement();

    const world = new World();
    world.getInstance().DOMGameContainer.appendChild(this.element);

    this.revealingText.init();
  }
}
