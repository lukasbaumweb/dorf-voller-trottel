import {
  /* webpackChunkName: "pixi" */ AnimatedSprite,
  Application,
  Assets,
  BLEND_MODES,
  Graphics,
} from "pixi.js";

import { PlayerKeyboard } from "../components/PlayerKeyboard";
import { Map } from "./Map";
import { withGrid } from "../utils";
import { Keyboard } from "../components/Keyboard";
import { demoLevel } from "../levels/demo";
import { CONFIG } from "../config";

export class World {
  constructor() {
    this.keyboard = new PlayerKeyboard();
    this.debug = true;
  }

  start(mapConfig) {
    this.map = new Map(mapConfig);
    this.map.world = this;
    this.map.mountObjects();

    this.app.ticker.add((delta) => {
      this.app.stage.removeChildren();
      const cameraPerson = this.map.gameObjects.hero;

      Object.values(this.map.gameObjects).forEach((object) => {
        object.update({
          arrow: this.keyboard.direction,
          map: this.map,
        });
      });

      this.map.drawLowerImage(this.app, cameraPerson);

      Object.values(this.map.gameObjects)
        .sort((a, b) => {
          return a.y - b.y;
        })
        .forEach((object) => {
          object.sprite.draw(this.app, delta, cameraPerson);
        });

      if (this.debug) {
        this.drawWalls(cameraPerson);
      }

      this.map.drawUpperImage(this.app, cameraPerson);
    });
  }

  drawWalls(cameraPerson) {
    Object.entries(this.map.walls).forEach(([position, blocked]) => {
      let graphics = null;
      if (graphics == null) {
        graphics = new Graphics();
        graphics.blendMode = BLEND_MODES.DARKEN;
        this.app.stage.addChild(graphics);
      }

      const [x, y] = position.split(",").map((s) => Number(s));

      const wallX =
        withGrid(CONFIG.OFFSET.x) - CONFIG.PIXEL_SIZE + x - cameraPerson.x;
      const wallY =
        withGrid(CONFIG.OFFSET.y) - CONFIG.PIXEL_SIZE + y - cameraPerson.y;

      graphics.beginFill(0xde3249);
      graphics.lineStyle(1, 0xfeeb77, 1);
      graphics.drawRect(wallX, wallY, CONFIG.PIXEL_SIZE, CONFIG.PIXEL_SIZE);
      graphics.endFill();
    });
  }

  bindActionInput() {
    new Keyboard("Enter", () => {
      //Is there a person here to talk to?
      // this.map.checkForActionCutscene();
    });
    new Keyboard("Escape", () => {
      if (!this.map.isCutscenePlaying) {
        // this.map.startCutscene([{ type: "pause" }]);
      }
    });
  }

  bindHeroPositionCheck() {
    document.addEventListener("PersonWalkingComplete", (e) => {
      if (e.detail.whoId === "hero") {
        //Hero's position has changed
        this.map.checkForFootstepCutscene();
      }
    });
  }

  async init(doc) {
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

    await Assets.load(["assets/spritesheets/characters.json"]);

    const map = demoLevel;
    this.start(map);
  }
}
