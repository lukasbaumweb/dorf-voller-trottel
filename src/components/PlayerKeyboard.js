export class PlayerKeyboard {
  constructor() {
    this.heldDirections = [];

    this.map = {
      ArrowUp: 'up',
      KeyW: 'up',
      ArrowDown: 'down',
      KeyS: 'down',
      ArrowLeft: 'left',
      KeyA: 'left',
      ArrowRight: 'right',
      KeyD: 'right'
    };
  }

  get direction() {
    return this.heldDirections[0];
  }

  init() {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
  }

  onKeyUp = (e) => {
    if (window._game?.isBlocked) return;

    const dir = this.map[e.code];
    const index = this.heldDirections.indexOf(dir);
    if (index > -1) {
      this.heldDirections.splice(index, 1);
    }
  };

  onKeyDown = (e) => {
    if (window._game?.isBlocked) return;

    const dir = this.map[e.code];
    if (dir && this.heldDirections.indexOf(dir) === -1) {
      this.heldDirections.unshift(dir);
    }
  };

  dispose() {
    document.removeEventListener('keyup', this.onKeyUp);
    document.removeEventListener('keydown', this.onKeyDown);
  }
}
