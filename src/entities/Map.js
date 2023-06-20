import { Container } from 'pixi.js';
import { nextPosition, withGrid } from '../utils';
import { Player } from './Character';
import { CONFIG } from '../config';
import { loadLayers, loadWalls } from '../lib/MapLoader';
import { getCurrentLevel } from '../gameState';

export class Map {
  constructor({ id, map, configObjects, walls, app }) {
    this.id = id || `ID: ${new Date().getTime()}-${Math.random() * 1000}`;
    this.walls = walls || {};

    this.map = map;

    this.configObjects = configObjects || {};
    this.app = app;
    this.gameObjects = {};
    this.layers = [];
  }

  initMap(layersContainer, cameraPerson) {
    this.layers = loadLayers(getCurrentLevel().map.config);
    this.walls = loadWalls(getCurrentLevel().map.config, cameraPerson).tiles;

    console.debug(this.layers);

    const containers = [];

    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];

      if (containers[i] === undefined) {
        containers.push(new Container());
        containers[i].zIndex = i;
        containers[i].name = layer.name;
        layersContainer.addChild(containers[i]);
      }

      const tiles = Object.values(layer.tiles);

      for (let y = 0; y < tiles.length; y++) {
        const tile = tiles[y];
        tile.sprite.x = withGrid(tile.x) - withGrid(CONFIG.OFFSET.x) - cameraPerson.x;
        tile.sprite.y = withGrid(tile.y) - withGrid(CONFIG.OFFSET.y) - cameraPerson.y;
        containers[i].addChild(tile.sprite);
      }
    }
  }

  getInteractableLayers() {
    const playerIndex = this.layers.findIndex((l) => l.name === CONFIG.PLAYER_LAYER);
    return this.layers.filter((_, index) => index > playerIndex);
  }

  update(cameraPerson) {
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      const tiles = Object.values(layer.tiles);
      for (let y = 0; y < tiles.length; y++) {
        const tile = tiles[y];
        tile.sprite.x = withGrid(tile.x) - cameraPerson.x - withGrid(CONFIG.OFFSET.x);
        tile.sprite.y = withGrid(tile.y) - cameraPerson.y - withGrid(CONFIG.OFFSET.y);
      }
    }
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = nextPosition(currentX, currentY, direction);

    if (this.walls[`${x},${y}`]) {
      return true;
    }

    // Check for game objects at this position
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

    const topBorder = 0;
    const bottomBorder = withGrid(CONFIG.levels.dorf.height) - CONFIG.PIXEL_SIZE;
    const leftBorder = 0 - CONFIG.PIXEL_SIZE;
    const rightBorder = withGrid(CONFIG.levels.dorf.width) - CONFIG.PIXEL_SIZE;

    if (y <= topBorder || y > bottomBorder) {
      return true;
    }

    if (x <= leftBorder || x > rightBorder) {
      return true;
    }
  }

  mountObjects(layersContainer) {
    const charactersContainer = layersContainer.children.find((layer) => layer.name === '######players######');
    Object.keys(this.configObjects).forEach((key) => {
      const object = this.configObjects[key];
      object.id = key;
      object.charactersContainer = charactersContainer;

      let instance;
      if (object.type === 'Character') {
        instance = new Player(object);
      }

      this.gameObjects[key] = instance;
      this.gameObjects[key].id = key;
      instance.mount(this);
    });
  }
}
