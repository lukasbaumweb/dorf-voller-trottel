import { /* webpackChunkName: "pixi" */ Application } from "pixi.js";

import { Keyboard, keyCodes } from "./../components/Keyboard";

export class World {
  keyboard = new Keyboard();

  constructor() {}

  init(doc) {
    const app = new Application({
      background: "#272d37",
      width: 352,
      height: 198,
    });

    const gameContainer = doc.createElement("div");
    gameContainer.classList.add("game-wrapper");
    gameContainer.appendChild(app.view);
    doc.body.appendChild(gameContainer);

    this.keyboard.registerEventlisteners();

    app.ticker.add(this.gameLoop);
  }

  checkKeys() {
    if (this.keyboard.getKeyPressed(keyCodes.arrowKeyUp)) {
      console.log("up");
    }
  }

  gameLoop(delta) {
    this.checkKeys();
  }
}
