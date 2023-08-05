import { makeid, setGameBlocked } from '../utils';
import { Keyboard } from './Keyboard';

export class Modal {
  wrapperHTML;
  modalHTML;
  headerHTML;
  contentHTML;

  constructor({ modalContent, title }) {
    this.id = makeid(5);
    this.isMounted = false;
    this.isVisible = false;
    this.isPlayed = false;
    this.title = title;
    this.modalContent = modalContent;
  }

  init() {
    if (this.isMounted) return;
    this.wrapperHTML = document.createElement('div');
    this.wrapperHTML.classList.add('modal-wrapper');

    this.modalHTML = document.createElement('div');
    this.modalHTML.classList.add('modal');
    this.wrapperHTML.appendChild(this.modalHTML);

    this.header = document.createElement('div');
    this.header.classList.add('modal-header');
    this.header.innerHTML = `<h3 class="modal-title"">${
      this.title || ''
    }<h3><button class="modal-close-btn" id="closeModal${this.id}"><img src="public/icons/close.svg" /></button>`;
    this.modalHTML.appendChild(this.header);

    this.contentHTML = document.createElement('div');
    this.contentHTML.classList.add('modal-content');
    this.contentHTML.innerHTML = 'Error';
    this.modalHTML.appendChild(this.contentHTML);

    document.body.appendChild(this.wrapperHTML);

    this.isMounted = true;
  }

  attachEventListeners() {
    document.getElementById(`closeModal${this.id}`).addEventListener('click', () => this.hide());

    new Keyboard('Escape', () => this.hide());
  }

  isImg() {
    return (
      this.modalContent.endsWith('.png') || this.modalContent.endsWith('.jpg') || this.modalContent.endsWith('.jpeg')
    );
  }

  displayModalContent() {
    if (this.isImg()) {
      this.contentHTML.innerHTML = `<img src="${this.modalContent}" />`;
    } else if (this.modalContent.endsWith('.html')) {
      this.contentHTML.innerHTML = `<iframe src="${this.modalContent}" height="100%" width="100%"></iframe>`;
    } else if (this.modalContent.endsWith('.js')) {
      const externalScript = document.createElement('script');
      externalScript.src = this.modalContent;
      externalScript.onload = () => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('modal-external-content-wrapper');
        this.contentHTML.innerHTML = '';
        this.contentHTML.appendChild(wrapper);
        window.externalScriptRunner.call(wrapper);
      };
      externalScript.onerror = (err) => {
        console.error(err);
      };
      document.head.appendChild(externalScript);
    }
  }

  show() {
    setGameBlocked(true);
    this.wrapperHTML.classList.add('show');
    this.wrapperHTML.style.display = 'flex';
    this.isVisible = true;
    if (this.isMounted && !this.isPlayed) {
      if (this.modalContent !== null) {
        this.displayModalContent();
      }
      this.attachEventListeners();
      this.isPlayed = true;
    }
  }

  hide() {
    this.wrapperHTML.classList.remove('show');
    this.wrapperHTML.style.display = 'none';
    this.isVisible = false;
    setGameBlocked(false);
  }

  toggle() {
    if (this.isVisible) this.hide();
    else this.show();
  }
}
