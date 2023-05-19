export const keyCodes = {
  arrowKeyUp: "38",
  arrowKeyDown: "40",
  arrowKeyRight: "39",
  arrowKeyLeft: "37",
};

export class Keyboard {
  keys = {};
  keyDown = (e) => {
    this.keys[e.keyCode] = true;
    console.debug("Key down: " + e.keyCode);
  };

  keyUp = (e) => {
    this.keys[e.keyCode] = false;
  };

  registerEventlisteners = () => {
    window.addEventListener("keydown", this.keyDown);
    window.addEventListener("keyup", this.keyUp);
  };

  unregisterEventlisteners = () => {
    window.removeEventListener("keydown", this.keyDown);
    window.removeEventListener("keyup", this.keyUp);
  };

  getKeyPressed(keyCode) {
    return keyCode in keyCodes && keyCodes[keyCode];
  }
}
