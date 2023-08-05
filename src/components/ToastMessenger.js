export class ToastMessage {
  toast;
  constructor(text, onClick) {
    this.text = text || '';

    this.onClick = () => {
      this.destroy();
      onClick && onClick();
    };
  }

  init() {
    this.toast = document.createElement('div');
    this.toast.classList.add('toast');
    this.toast.addEventListener('click', this.onClick);
    this.toast.innerHTML = `
        <i class="fa fa-check" aria-hidden="true"></i>
        <p>${this.text}</p>
    `;

    document.getElementById('toastWrapper').appendChild(this.toast);
  }

  show() {
    this.toast.classList.add('show');
  }

  destroy() {
    this.toast.remove('show');

    setTimeout(() => {
      this.toast.removeEventListener('click', this.onClick);
      this.toast.parentElement?.removeChild(this.toast);
    }, 320);
  }
}

export const initToastMessenger = () => {
  if (document.getElementById('toastWrapper') !== null) return;

  const wrapper = document.createElement('div');
  wrapper.classList.add('toast-wrapper');
  wrapper.id = 'toastWrapper';
  document.body.appendChild(wrapper);

  document.addEventListener('showToastMessage', ({ detail }) => {
    console.debug('showToastMessage', detail);
    const toast = new ToastMessage(detail.text, detail.onClick);
    toast.init();
    toast.show();
  });
};
