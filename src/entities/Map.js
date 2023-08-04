import { Container } from 'pixi.js';
import { nextPosition, withGrid } from '../utils';
import { Player } from './Player';
import { CONFIG } from '../config';
import { loadLayers, loadMapLayers, loadWalls, loadObjects } from '../lib/MapLoader';
import { getCurrentMap } from '../gameState';
import { Portal } from './Portal';
import { STORAGE_KEYS, getStoredValue } from '../lib/Storage';
import { TextMessage } from '../components/TextMessage';
import { translate } from '../lib/Translator';
import { Character } from './Character';
import { GameEvent } from '../components/GameEvent';
import { Item } from './Item';
import { Marker } from './Marker';
import { loadLevel } from '../lib/AssetLoader';

export class Map {
  constructor({ map, app, layersContainer }) {
    const level = getCurrentMap();

    this.id = level.id || `ID: ${new Date().getTime()}-${Math.random() * 1000}`;
    this.walls = level.walls || {};

    this.map = map;

    this.app = app;
    this.gameObjects = {};
    this.markers = {};
    this.items = {};
    this.portals = {};
    this.layers = [];
    this.isCutscenePlaying = false;
    this.cameraPerson = null;
    this.layersContainer = layersContainer;
  }

  async initMap() {
    const level = CONFIG.maps[getCurrentMap()];
    await loadLevel(getCurrentMap());

    const map = level.map;

    this.maps = loadMapLayers(map);
    this.walls = loadWalls(map.config, level.configObjects.hero).tiles;
    this.objects = loadObjects(map.config);
    this.layers = loadLayers(map.config).map((layer) => {
      const container = new Container();

      container.name = layer.name;
      container.zIndex = layer.zIndex;

      this.layersContainer.addChild(container);
      return container;
    });

    this.layers.find((l) => l.name === 'ground').addChild(this.maps.lower);
    this.layers.find((l) => l.name === 'map (upper)').addChild(this.maps.upper);
    this.mountObjects();

    // console.debug(this.layers);
  }

  mountObjects() {
    console.groupCollapsed('Mounting objects');
    const level = CONFIG.maps[getCurrentMap()];

    const charactersContainer = this.layersContainer.children.find((layer) => layer.name === '######players######');
    const objectsContainer = this.layersContainer.children.find((layer) => layer.name === 'objects');

    this.configObjects = level.configObjects || {};
    this.markers = level.markers || {};
    this.portals = {};
    this.items = {};

    Object.keys(this.configObjects).forEach((key) => {
      const object = this.configObjects[key];
      object.id = key;

      let instance;
      if (object.type === 'Player') {
        object.container = charactersContainer;
        const savedPlayer = getStoredValue(STORAGE_KEYS.player);

        const combined = Object.assign(object, savedPlayer);
        instance = new Player(combined);
      } else if (object.type === 'NPC') {
        object.container = charactersContainer;
        const saved = getStoredValue(STORAGE_KEYS.npc, {});

        const combined = Object.assign(object, saved);
        instance = new Character(combined);
      }

      this.gameObjects[key] = instance;
      this.gameObjects[key].id = key;
      instance.mount(this);
    });

    this.objects.forEach((obj) => {
      let config = {
        container: objectsContainer,
        id: obj.name,
        x: obj.x,
        y: obj.y
      };
      let instance;

      const portal = level.portals && level.portals[obj.name];
      const marker = level.markers && level.markers[obj.name];
      const item = level.items && level.items[obj.name];

      if (portal) {
        config = Object.assign(portal, config);
        instance = new Portal(config);
        this.portals[obj.name] = instance;
      } else if (marker) {
        config = Object.assign(marker, config);
        instance = new Marker(config);
        this.markers[obj.name] = instance;
      } else if (item) {
        config = Object.assign(item, config);
        instance = new Item(config);
        this.items[obj.name] = instance;
      }

      if (portal || marker || item) {
        instance.mount(this);
      }
    });

    this.movePlayerIfOnPortal();

    console.groupEnd();
  }

  movePlayerIfOnPortal() {
    const hero = this.gameObjects.hero;

    const match = Object.values(this.portals).find((object) => {
      return `${object.x},${object.y}` === `${hero.x},${hero.y}`;
    });
    if (match) {
      const directions = ['down', 'up', 'right', 'left'].filter(
        (direction) => !this.isSpaceTaken(this.gameObjects.hero.x, this.gameObjects.hero.y, direction)
      );
      if (directions.length > 0) {
        switch (directions[0]) {
          case 'down':
            this.gameObjects.hero.y += CONFIG.PIXEL_SIZE;
            break;
          case 'up':
            this.gameObjects.hero.y -= CONFIG.PIXEL_SIZE;
            break;
          case 'left':
            this.gameObjects.hero.x -= CONFIG.PIXEL_SIZE;
            break;
          default:
            this.gameObjects.hero.x += CONFIG.PIXEL_SIZE;
            break;
        }
      } else {
        console.error('Cannot move in any side. Player will be left staying on portal');
      }
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
      child.parent.removeChild(child);
    }
  }

  unmount() {
    Object.values(this.gameObjects).forEach((obj) => {
      obj.unmount();
    });

    Object.values(this.portals).forEach((obj) => {
      obj.unmount();
    });

    Object.values(this.markers).forEach((obj) => {
      obj.unmount();
    });

    Object.values(this.items).forEach((obj) => {
      obj.unmount();
    });

    this.layers.forEach((child) => child.parent.removeChild(child));

    this.layers = [];
    this.walls = {};

    this.configObjects = {};
    this.markers = {};
    this.portals = {};
    this.gameObjects = {};
    this.items = {};
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

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i = 0; i < events.length; i++) {
      const eventHandler = new GameEvent({
        event: events[i],
        map: this
      });
      const result = await eventHandler.init();
      if (result === 'ERROR') {
        break;
      }
    }
    this.isCutscenePlaying = false;
  }

  checkForActionCutscene() {
    if (window._game.isBlocked) return;

    const hero = this.gameObjects.hero;
    const nextCoords = nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find((object) => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`;
    });

    if (!this.isCutscenePlaying && match && match.talking.length) {
      const currentProgress = getStoredValue(STORAGE_KEYS.playerStoryProgress);
      const relevantScenario = match.talking.find((scenario) => {
        return (scenario.required || []).every((storyFlag) => {
          return currentProgress[storyFlag];
        });
      });
      relevantScenario && this.startCutscene(relevantScenario.events);
    }
  }

  checkForPortals() {
    const hero = this.gameObjects.hero;

    const match = Object.values(this.portals).find((object) => {
      return `${object.x},${object.y}` === `${hero.x},${hero.y}`;
    });

    if (!this.isCutscenePlaying && match && match.transitionToMap) {
      const onComplete = () => {
        let targetPosition = CONFIG.maps[match.transitionToMap].configObjects.hero;

        if (match.transitionToMap === CONFIG.maps.dorf.id) {
          const currentMap = getCurrentMap();
          const targetPortal = Object.values(CONFIG.maps[match.transitionToMap].portals)
            .filter(({ id }) => id === currentMap)
            .at(0);

          console.log(targetPortal);
          if (targetPortal !== undefined) {
            targetPosition = { x: targetPortal.x, y: targetPortal.y, direction: targetPortal.direction };
          }
        }

        new GameEvent({
          map: this,
          event: {
            type: 'changeMap',
            transitionToMap: match.transitionToMap,
            x: targetPosition.x,
            y: targetPosition.y,
            direction: targetPosition.direction || 'down'
          }
        }).init();
      };

      new TextMessage({
        text: translate(match.text) || `${translate(match.id)} ${translate('enter')}`,
        onAcceptText: translate(match.onAcceptText) || translate('enter'),
        onComplete
      }).init();
    }
  }

  checkForItems() {
    const hero = this.gameObjects.hero;

    const match = Object.values(this.markers).find((object) => {
      return `${object.x},${object.y}` === `${hero.x},${hero.y}`;
    });

    if (match) {
      new TextMessage({
        text: `${translate(match.id)}`,
        onCancelText: translate('ignore'),
        onAcceptText: translate('examine'),
        onComplete: () => {
          match.showModal();
        }
      }).init();
    }
  }
}
