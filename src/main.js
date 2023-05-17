import * as PIXI from "pixi.js";
import "./style.css";

import { Player } from "./entities";
import { SPRITES } from "./sprites";
import { Loader } from "./components/Loader";
import { Keyboard } from "./components/Keyboard";

const app = new PIXI.Application({ background: "#272d37" });
window.app = app;
document.body.appendChild(app.view);

const gameloop = (delta) => {
  if (keyboard.keys["87"]) {
  }
};

const loader = new Loader();

loader.show();

const keyboard = new Keyboard();
keyboard.registerEventlisteners();

loader.hide();

app.ticker.add(gameloop);
