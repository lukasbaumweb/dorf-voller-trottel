import { Container, Sprite } from "pixi.js";
import { nextPosition, withGrid } from "../utils";
import { Person } from "./Person";
import { CONFIG } from "../config";
import { loadLayers, loadWalls } from "../lib/MapLoader";

export class Map {
  constructor({ id, map, configObjects, walls, app }) {
    this.id = id || `ID: ${new Date().getTime()}${Math.random()}`;
    this.walls = walls || {};

    this.map = map;

    this.configObjects = configObjects || {};
    this.app = app;
    this.gameObjects = {};
    this.layers = [];
  }

  initMap(gameContainer, cameraPerson) {
    this.layers = loadLayers(CONFIG.assets.maps.dorf.config);
    this.walls = loadWalls(CONFIG.assets.maps.dorf.config, cameraPerson).tiles;

    console.log(this.layers);

    let container;

    if (!container) {
      container = new Container();
      gameContainer.addChild(container);
    }

    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      console.log(layer);
      for (let y = 0; y < layer.tiles.length; y++) {
        const tile = layer.tiles[y];
        tile.sprite.x = withGrid(tile.x) - withGrid(CONFIG.OFFSET.x) - cameraPerson.x;
        tile.sprite.y = withGrid(tile.y) - withGrid(CONFIG.OFFSET.y) - cameraPerson.y;
        container.addChild(tile.sprite);
      }
    }

    container.eventMode = "static";

    // Shows hand cursor
    container.on("pointermove", (e) => {
      // console.log(e);
    });
  }

  update(cameraPerson) {
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      for (let y = 0; y < layer.tiles.length; y++) {
        const tile = layer.tiles[y];
        tile.sprite.x = withGrid(tile.x) - withGrid(CONFIG.OFFSET.x) - cameraPerson.x;
        tile.sprite.y = withGrid(tile.y) - withGrid(CONFIG.OFFSET.y) - cameraPerson.y;
      }
    }
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
      if (obj.intentPosition && obj.intentPosition[0] === x && obj.intentPosition[1] === y) {
        return true;
      }
      return false;
    });
  }

  isOutofBounds(currentX, currentY, direction) {
    const { x, y } = nextPosition(currentX, currentY, direction);

    const topBorder = withGrid(-CONFIG.OFFSET.y * 2);
    const bottomBorder = withGrid(-CONFIG.OFFSET.y * 2) + withGrid(CONFIG.assets.maps.dorf.height);
    const leftBorder = withGrid(-CONFIG.OFFSET.x * 2);
    const rightBorder = withGrid(-CONFIG.OFFSET.x * 2) + withGrid(CONFIG.assets.maps.dorf.width);

    if (y <= topBorder || y > bottomBorder) {
      return true;
    }

    if (x <= leftBorder || x > rightBorder) {
      return true;
    }
  }

  mountObjects(container) {
    Object.keys(this.configObjects).forEach((key) => {
      let object = this.configObjects[key];
      object.id = key;
      object.container = container;

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
