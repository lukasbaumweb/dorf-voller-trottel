import { Keyboard } from './../components/Keyboard';

export class Modal {
  wrapperHTML;
  modalHTML;
  headerHTML;
  contentHTML;

  constructor({ modalContent }) {
    this.isMounted = false;
    this.isVisible = false;

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
    this.header.innerHTML =
      '<button class="modal-close-btn" id="closeModal"><img src="public/icons/close.svg" /></button>';
    this.modalHTML.appendChild(this.header);

    this.contentHTML = document.createElement('div');
    this.contentHTML.classList.add('modal-content');
    this.contentHTML.innerHTML = 'Error';
    this.modalHTML.appendChild(this.contentHTML);

    document.body.appendChild(this.wrapperHTML);

    if (this.modalContent !== null) {
      this.displayModalContent();
    }
    this.attachEventListeners();
    this.isMounted = false;
  }

  attachEventListeners() {
    document.getElementById('closeModal').addEventListener('click', () => {
      this.hide();
    });

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
    }
  }

  show() {
    this.wrapperHTML.classList.add('show');
    this.wrapperHTML.style.display = 'flex';
    this.isVisible = true;
  }

  hide() {
    this.wrapperHTML.classList.remove('show');
    this.wrapperHTML.style.display = 'none';

    this.isVisible = false;
  }

  toggle() {
    if (this.isVisible) this.hide();
    else this.show();
  }
}
