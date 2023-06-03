import { Assets, Container, Loader, Sprite } from "pixi.js";
import { nextPosition, withGrid } from "../utils";
import { Person } from "./Person";
import { CONFIG, getAsset } from "../config";
import { CompositeTilemap } from "@pixi/tilemap";
export class Map {
  constructor({ id, map, configObjects, walls, app }) {
    this.id = id || `ID: ${new Date().getTime()}${Math.random()}`;
    this.walls = walls || {};

    this.map = map;

    this.configObjects = configObjects || {};
    this.app = app;
    this.gameObjects = {};
  }

  renderMap(gameContainer, cameraPerson) {
    const cached = Assets.get(getAsset(CONFIG.assets.maps.dorf));
    const map = PIXI.Sprite.from(cached.tilesets[0].image);
    console.log(cached);
    console.log(map);

    const tilemap = new CompositeTilemap();

    // Render your first tile at (0, 0)!
    const newArr = [];
    while (cached.layers[0].data.length)
      newArr.push(cached.layers[0].data.splice(0, cached.layers[0].width));
    console.log(newArr);
    for (let y = 0; y < newArr.length; y++) {
      for (let x = 0; x < newArr[y].length; x++) {
        const element = newArr[y][x];
        tilemap.tile(getAsset(cached.tilesets[0].image), x, y);
      }
    }

    const container = new Container();
    container.x = withGrid(CONFIG.OFFSET.x) - cameraPerson.x;
    container.y = withGrid(CONFIG.OFFSET.y) - cameraPerson.y;

    container.eventMode = "static";

    // Shows hand cursor
    container.on("pointermove", (e) => {
      // console.log(e);
    });

    let sprite = Sprite.from(getAsset(cached.tilesets[0].image));
    sprite.anchor.set(0.5);

    container.addChild(sprite);

    gameContainer.addChild(container);
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
        instance = new Person({
          useShadow: true,
          texture: object.texture,
          ...object,
        });
      }

      this.gameObjects[key] = instance;
      this.gameObjects[key].id = key;
      instance.mount(this);
    });
  }
}
