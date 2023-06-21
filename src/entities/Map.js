import { Container } from 'pixi.js';
import { nextPosition, withGrid } from '../utils';
import { Player } from './Player';
import { CONFIG } from '../config';
import { loadLayers, loadMaps, loadWalls } from '../lib/MapLoader';
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
    this.maps = loadMaps(getCurrentLevel().map.lowerImage, getCurrentLevel().map.upperImage);
    this.walls = loadWalls(getCurrentLevel().map.config, cameraPerson).tiles;
    this.layers = loadLayers(getCurrentLevel().map.config).map((layer) => {
      const container = new Container();

      container.name = layer.name;
      container.zIndex = layer.zIndex;

      layersContainer.addChild(container);
      return container;
    });

    this.layers.find((l) => l.name === 'ground').addChild(this.maps.lower);
    this.layers.find((l) => l.name === 'map (upper)').addChild(this.maps.upper);

    console.debug(this.layers);
  }

  update(cameraPerson) {
    for (const layer of this.layers) {
      if (layer.name === 'ground' || layer.name === 'map (upper)') {
        layer.children[0].x = withGrid(0) - cameraPerson.x - withGrid(CONFIG.OFFSET.x);
        layer.children[0].y = withGrid(0) - cameraPerson.y - withGrid(CONFIG.OFFSET.y);
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
