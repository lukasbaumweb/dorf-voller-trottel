export class Keyboard {
  keyCodes = {
    keyUp: "38",
    keyDown: "40",
    keyRight: "39",
    keyLeft: "37",
  };

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
}
