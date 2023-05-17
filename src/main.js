import * as PIXI from "pixi.js";

import { Player } from "./entities";
import { SPRITES } from "./sprites";
import { Loader } from "./components/Loader";
import { Keyboard } from "./components/Keyboard";

const app = new PIXI.Application({ background: "#272d37" });
window.app = app;
document.body.appendChild(app.view);

app.ticker.add(gameloop);

const loader = new Loader();

loader.show();

const keyboard = new Keyboard();
keyboard.registerEventlisteners();

loader.hide();

const gameloop = (delta) => {
  if (keyboard.keys["87"]) {
  }
};
