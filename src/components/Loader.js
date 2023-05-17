import * as PIXI from "pixi.js";
import { SPRITES } from "../sprites";

export class Loader {
  async show() {
    window.app.stage.removeChildren();
    const loader = PIXI.Sprite.from((await SPRITES.loader).default);
    loader.anchor.set(0.5);

    loader.x = window.app.screen.width / 2;
    loader.y = window.app.screen.height / 2;

    const loaderText = new PIXI.Text("Loading...");
    loaderText.x = window.app.screen.width / 2 - loaderText.width / 2;
    loaderText.y = window.app.screen.height / 2 + 50;
    loaderText.style.fill = "#ffffff";

    window.app.stage.addChild(loader);
    window.app.stage.addChild(loaderText);

    window.app.ticker.add((delta) => {
      loader.rotation += 0.1 * delta;
    });
  }

  hide() {
    window.app.stage.removeChildren();
  }
}
