import { Container } from 'pixi.js';
import { nextPosition, withGrid } from '../utils';
import { Player } from './Player';
import { CONFIG } from '../config';
import { loadLayers, loadMapLayers, loadWalls } from '../lib/MapLoader';
import { getCurrentLevel, setCurrentLevel } from '../gameState';
import { Marker } from './Marker';
import { Storage } from '../lib/Storage';
import { TextMessage } from '../components/TextMessage';
import { translate } from '../lib/Translator';
import { Character } from './Character';
import { GameEvent } from '../components/GameEvent';

export class Map {
  constructor({ level, map, app, layersContainer }) {
    this.id = level.id || `ID: ${new Date().getTime()}-${Math.random() * 1000}`;
    this.walls = level.walls || {};

    this.map = map;

    this.configObjects = level.configObjects || {};
    this.markerObjects = level.markerObjects || {};
    this.app = app;
    this.gameObjects = {};
    this.layers = [];
    this.isCutscenePlaying = false;
    this.cameraPerson = null;
    this.layersContainer = layersContainer;
  }

  initMap() {
    const map = getCurrentLevel().map;
    this.maps = loadMapLayers(map);
    this.walls = loadWalls(map.config, this.gameObjects.hero).tiles;
    this.layers = loadLayers(map.config).map((layer) => {
      const container = new Container();

      container.name = layer.name;
      container.zIndex = layer.zIndex;

      this.layersContainer.addChild(container);
      return container;
    });

    this.layers.find((l) => l.name === 'ground').addChild(this.maps.lower);
    this.layers.find((l) => l.name === 'map (upper)').addChild(this.maps.upper);

    console.debug(this.layers);
  }

  mountObjects() {
    console.groupCollapsed('Mounting objects');
    const charactersContainer = this.layersContainer.children.find((layer) => layer.name === '######players######');
    const objectsContainer = this.layersContainer.children.find((layer) => layer.name === 'objects');

    Object.keys(this.configObjects).forEach((key) => {
      const object = this.configObjects[key];
      object.id = key;

      let instance;
      if (object.type === 'Player') {
        object.container = charactersContainer;
        const savedPlayer = Storage.get(Storage.STORAGE_KEYS.player);

        const combined = Object.assign(object, savedPlayer);
        instance = new Player(combined);
      } else if (object.type === 'NPC') {
        object.container = charactersContainer;
        const saved = Storage.get(Storage.STORAGE_KEYS.npc, {});

        const combined = Object.assign(object, saved);
        instance = new Character(combined);
      }

      this.gameObjects[key] = instance;
      this.gameObjects[key].id = key;
      instance.mount(this);
    });

    Object.keys(this.markerObjects).forEach((key) => {
      const object = this.markerObjects[key];
      object.id = key;

      object.container = objectsContainer;
      const instance = new Marker(object);

      this.markerObjects[key] = instance;
      this.markerObjects[key].id = key;
      instance.mount(this);
    });
    this.movePlayerIfOnMarker();

    console.groupEnd();
  }

  movePlayerIfOnMarker() {
    const hero = this.gameObjects.hero;

    const match = Object.values(this.markerObjects).find((object) => {
      return `${object.x},${object.y}` === `${hero.x},${hero.y}`;
    });
    if (match) {
      this.gameObjects.hero.y += CONFIG.PIXEL_SIZE;
    }
  }

  update() {
    const cameraPerson = this.gameObjects.hero;
    for (const layer of this.layers) {
      if (layer.name === 'ground' || layer.name === 'map (upper)') {
        if (layer.children.length > 0) {
          layer.children[0].x = withGrid(0) - cameraPerson.x - withGrid(CONFIG.OFFSET.x);
          layer.children[0].y = withGrid(0) - cameraPerson.y - withGrid(CONFIG.OFFSET.y);
        }
      }
    }
  }

  clearChildren(parent) {
    if (parent.children.length === 0) return;
    for (let i = 0; i < parent.children.length; i++) {
      const child = parent.children[i];
      this.clearChildren(child);
      child.destroy({ children: true, texture: true, baseTexture: true });
    }
  }

  unmount() {
    this.layers.forEach((c) => this.clearChildren(c));
    this.layersContainer.children.forEach((c) => this.clearChildren(c));
    Object.keys(this.gameObjects).forEach((obj) => {
      this.gameObjects[obj].unmount();
    });

    this.layers = [];
    this.layersContainer.children = [];
    this.walls = {};

    this.configObjects = {};

    this.markerObjects = {};
    this.gameObjects = {};
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = nextPosition(currentX, currentY, direction);
    if (this.walls[`${x},${y}`]) return true;

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

  startCutscene() {}

  checkForActionCutscene() {
    console.log(window._game.isBlocked);
    if (window._game.isBlocked) return;

    const hero = this.gameObjects.hero;
    const nextCoords = nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find((object) => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`;
    });

    if (!this.isCutscenePlaying && match && match.talking.length) {
      // const relevantScenario = match.talking.find((scenario) => {
      //   return (scenario.required || []).every((sf) => {
      //     return playerState.storyFlags[sf];
      //   });
      // });
      // relevantScenario && this.startCutscene(relevantScenario.events);
    }
  }

  checkForMarkers() {
    const hero = this.gameObjects.hero;

    const match = Object.values(this.markerObjects).find((object) => {
      return `${object.x},${object.y}` === `${hero.x},${hero.y}`;
    });

    if (match) {
      new TextMessage({
        text: `${translate(match.id)} betreten`,
        onCancel: () => {
          console.debug('canceled');
        },
        onAcceptText: 'Betreten',
        onComplete: () => {
          console.log(match);
          new GameEvent({
            map: this,
            event: {
              type: 'changeMap',
              transitionToMap: match.transitionToMap,
              x: '',
              y: '',
              direction: 'up'
            }
          }).init();
          setCurrentLevel(CONFIG.levels[match.transitionToMap]);
        }
      }).init();
    }
  }
}
