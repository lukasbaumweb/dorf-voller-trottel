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

export class Map {
  constructor({ id, map, configObjects, walls, app }) {
    this.id = id || `ID: ${new Date().getTime()}${Math.random()}`;
    this.walls = walls || {};

    this.map = map;

    this.configObjects = configObjects || {};
    this.app = app;
    this.gameObjects = {};
  }

  initMap(gameContainer, cameraPerson) {
    const cached = Assets.get(getAsset(CONFIG.assets.maps.dorf));
    const texture = Texture.from(CONFIG.assets.textures.dorf.img);

    // Render your first tile at (0, 0)!
    const newArr = [];
    while (cached.layers[0].data.length)
      newArr.push(cached.layers[0].data.splice(0, cached.layers[0].width));

    for (let y = 0; y < newArr.length; y++) {
      for (let x = 0; x < newArr[y].length; x++) {
        const element = newArr[y][x];
        // console.log(y + 1, x + 1);
        // texture.frame = new Rectangle(
        //   x*CONFIG.PIXEL_SIZE,
        //   y*CONFIG.PIXEL_SIZE,
        //   CONFIG.PIXEL_SIZE,
        //   CONFIG.PIXEL_SIZE
        // );
        // const cat = new Sprite(texture);

        // tilemap.tile(cat, x, y);
      }
    }
    // texture.frame = new Rectangle(
    //   0 * CONFIG.PIXEL_SIZE,
    //   0 * CONFIG.PIXEL_SIZE,
    //   0 * CONFIG.PIXEL_SIZE,
    //   0 * CONFIG.PIXEL_SIZE
    // );
    // const cat = new Sprite(texture);

    let container;
    let tilemap;

    if (!container) {
      container = new Container();
      gameContainer.addChild(container);
    }
    if (!tilemap) {
      tilemap = new TilingSprite(texture, CONFIG.PIXEL_SIZE, CONFIG.PIXEL_SIZE);
      container.addChild(tilemap);
    }

    container.x = withGrid(CONFIG.OFFSET.x) - cameraPerson.x;
    container.y = withGrid(CONFIG.OFFSET.y) - cameraPerson.y;

    container.eventMode = "static";

    // Shows hand cursor
    container.on("pointermove", (e) => {
      // console.log(e);
    });

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
