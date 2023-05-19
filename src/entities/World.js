import { /* webpackChunkName: "pixi" */ Application, Assets } from "pixi.js";

import { Keyboard } from "./../components/Keyboard";
import { Map } from "./Map";
import { withGrid } from "../utils";

export class World {
  constructor() {
    this.keyboard = new Keyboard();
  }

  start(mapConfig) {
    this.map = new Map(mapConfig);
    this.map.world = this;
    this.map.mountObjects();

    this.app.ticker.add((delta) => {
      //Establish the camera person
      const cameraPerson = this.map.gameObjects.hero;

      //Update all objects
      Object.values(this.map.gameObjects).forEach((object) => {
        object.update({
          arrow: this.keyboard.direction,
          map: this.map,
        });
      });

      this.map.drawLowerImage(this.app);

      //Draw Game Objects
      Object.values(this.map.gameObjects)
        .sort((a, b) => {
          return a.y - b.y;
        })
        .forEach((object) => {
          object.sprite.draw(this.app, cameraPerson);
        });

      this.map.drawUpperImage(this.app);
    });
  }

  checkKeys() {
    if (this.keyboard.getKeyPressed(keyCodes.arrowKeyUp)) {
      console.log("up");
    }
  }

  init(doc) {
    this.app = new Application({
      background: "#272d37",
      width: 352,
      height: 198,
    });

    const gameContainer = doc.createElement("div");
    gameContainer.classList.add("game-wrapper");
    gameContainer.appendChild(this.app.view);
    doc.body.appendChild(gameContainer);

    this.keyboard.init();

    Assets.load(["assets/spritesheets/character.json"]);

    const map = {
      lowerSrc: "/assets/DemoLower.png",
      upperSrc: "/assets/DemoUpper.png",
      configObjects: {
        hero: {
          type: "Person",
          isPlayerControlled: true,
          x: withGrid(5),
          y: withGrid(6),
        },
      },
    };
    this.start(map);
  }
}
