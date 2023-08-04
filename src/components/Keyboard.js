export class Keyboard {
  constructor(keyCode, callback) {
    let keySafe = true;
    this.keydownFunction = function (event) {
      // console.debug(event.code);
      if (event.code === keyCode) {
        if (keySafe) {
          keySafe = false;
          callback();
        }
      }
    };
    this.keyupFunction = function (event) {
      if (event.code === keyCode) {
        keySafe = true;
      }
    };
    document.addEventListener('keydown', this.keydownFunction);
    document.addEventListener('keyup', this.keyupFunction);
  }

  dispose() {
    document.removeEventListener('keydown', this.keydownFunction);
    document.removeEventListener('keyup', this.keyupFunction);
  }
}
