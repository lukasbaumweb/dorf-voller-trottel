import { Sprite } from "pixi.js";
import { nextPosition, withGrid } from "../utils";
import { Person } from "./Person";

export class Map {
  constructor({ id, lowerSrc, upperSrc, configObjects, walls, app }) {
    this.id = id || `ID: ${new Date().getTime()}${Math.random()}`;
    this.walls = walls || {};

    this.lowerImage = lowerSrc || "";

    this.upperImage = upperSrc || "";
    this.configObjects = configObjects || {};
    this.app = app;
    this.gameObjects = {};
  }

  drawLowerImage(app, cameraPerson) {
    let sprite = Sprite.from(this.lowerImage);
    sprite.anchor.set(0.5);

    sprite.x = app.screen.width / 2;
    sprite.y = app.screen.height / 2;
    app.stage.addChild(sprite);
    // this.app.drawImage(
    //   this.lowerImage,
    //   withGrid(10.5), // - cameraPerson.x,
    //   withGrid(6) // - cameraPerson.y
    // );
  }

  drawUpperImage(app, cameraPerson) {
    let sprite = Sprite.from(this.upperImage);
    sprite.anchor.set(0.5);

    sprite.x = app.screen.width / 2;
    sprite.y = app.screen.height / 2;
    app.stage.addChild(sprite);
    // this.app.drawImage(
    //   this.upperImage,
    //   withGrid(10.5), //- cameraPerson.x,
    //   withGrid(6) // - cameraPerson.y
    // );
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = nextPosition(currentX, currentY, direction);
    if (this.walls[`${x},${y}`]) {
      return true;
    }
    //Check for game objects at this position
    return Object.values(this.gameObjects).find((obj) => {
      if (obj.x === x && obj.y === y) {
        return true;
      }
      if (
        obj.intentPosition &&
        obj.intentPosition[0] === x &&
        obj.intentPosition[1] === y
      ) {
        return true;
      }
      return false;
    });
  }

  mountObjects() {
    Object.keys(this.configObjects).forEach((key) => {
      let object = this.configObjects[key];
      object.id = key;

      let instance;
      if (object.type === "Person") {
        instance = new Person(object);
      }

      this.gameObjects[key] = instance;
      this.gameObjects[key].id = key;
      instance.mount(this);
    });
  }
}
