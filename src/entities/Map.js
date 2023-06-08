import {
  Assets,
  Container,
  Loader,
  Rectangle,
  Sprite,
  Texture,
  TilingSprite,
} from "pixi.js";
import { nextPosition, withGrid } from "../utils";
import { Person } from "./Person";
import { CONFIG, getAsset } from "../config";
import { loadMap as loadLayers } from "../lib/MapLoader";

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
    // const cached = Assets.get(getAsset(CONFIG.assets.maps.dorf));
    // const texture = Texture.from(CONFIG.assets.textures.dorf.img);

    this.layers = loadLayers();
    console.log(this.layers);

    let container;

    if (!container) {
      container = new Container();
      gameContainer.addChild(container);
    }

    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];

      for (let j = 0; j < layer.tiles.length; j++) {
        const tile = layer.tiles[j];

        container.addChild(tile.sprite);
      }
    }

    // container.x = withGrid(CONFIG.OFFSET.x) - cameraPerson.x;
    // container.y = withGrid(CONFIG.OFFSET.y) - cameraPerson.y;

    container.eventMode = "static";

    // Shows hand cursor
    container.on("pointermove", (e) => {
      // console.log(e);
    });
  }

  update(cameraPerson) {
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];

      for (let j = 0; j < layer.tiles.length; j++) {
        const tile = layer.tiles[j];

        tile.sprite.x =
          tile.x * CONFIG.PIXEL_SIZE -
          withGrid(CONFIG.OFFSET.x) -
          cameraPerson.x;
        tile.sprite.y =
          tile.y * CONFIG.PIXEL_SIZE -
          withGrid(CONFIG.OFFSET.y) -
          cameraPerson.y;
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
