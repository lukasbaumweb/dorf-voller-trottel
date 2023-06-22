import { Application, BLEND_MODES, Container, Graphics } from 'pixi.js';

import { Map } from './Map';
import { withGrid } from '../utils';
import { Keyboard } from '../components/Keyboard';
import { CONFIG } from '../config';

import { DebugHud } from '../lib/DebugHud';

const GLOBAL_KEY = '_world';

export class World {
  DOMGameContainer = null;

  // debug variables
  debug = false;
  debugContainer = null;
  debugGraphics = [];
  runOnce = false;
  debugTexts = [];
  isMounted = false;

  constructor() {
    this.getInstance();
  }

  getInstance() {
    if (window[GLOBAL_KEY] === undefined) {
      if (!window[GLOBAL_KEY]) {
        window[GLOBAL_KEY] = this;
      } else {
        let props = Object.getOwnPropertyNames(this);

        for (const prop of props) {
          this[prop] = window[GLOBAL_KEY][prop];
        }
      }
      window[GLOBAL_KEY] = this;
      return this;
    } else {
      return window[GLOBAL_KEY];
    }
  }

  mount() {
    if (this.isMounted) return;

    this.app = new Application({
      background: '#272d37',
      width: CONFIG.GAME_CONFIG.width,
      height: CONFIG.GAME_CONFIG.height
    });

    this.layersContainer = new Container();
    this.layersContainer.sortableChildren = true;
    this.app.stage.addChild(this.layersContainer);

    this.DOMGameContainer = document.createElement('div');
    this.DOMGameContainer.sortableChildren = true;
    this.DOMGameContainer.style.setProperty('--game-width', CONFIG.GAME_CONFIG.width + 'px');
    this.DOMGameContainer.style.setProperty('--game-height', CONFIG.GAME_CONFIG.height + 'px');
    this.DOMGameContainer.classList.add('game-wrapper');
    this.DOMGameContainer.appendChild(this.app.view);
    document.body.appendChild(this.DOMGameContainer);

    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.isMounted = true;
  }

  init() {
    this.mount();

    // TODO: Load game state from database (local or server?)
    const level = CONFIG.levels.dorf;
    this.start(level);
  }

  start(level) {
    this.map = new Map(level);
    this.map.world = this;

    const cameraPerson = level.configObjects.hero;

    this.map.initMap(this.layersContainer, cameraPerson);

    this.map.mountObjects(this.layersContainer);

    // init gameloop
    this.app.ticker.add(this.gameLoopReference);
  }

  gameLoopReference = (delta) => this.gameloop(this, delta);

  gameloop(ctx, delta) {
    const cameraPerson = this.map.gameObjects.hero;

    this.map.update(cameraPerson);

    if (this.debug) {
      DebugHud.shared.show();

      this.drawWalls(cameraPerson);
    }

    Object.values(this.map.gameObjects).forEach((object) => {
      object.update(this.map, cameraPerson);
    });

    Object.values(this.map.markerObjects).forEach((object) => {
      object.update(this.map, cameraPerson);
    });

    if (this.debug && !this.runOnce) {
      console.debug(this.layersContainer.children);
      this.runOnce = true;
    }
  }

  deleteWalls() {
    for (let i = 0; i < this.debugGraphics.length; i++) {
      const g = this.debugGraphics[i];

      if (g) {
        g.destroy();
      }
    }
    this.debugGraphics = [];
  }

  drawWalls(cameraPerson) {
    if (this.debugContainer === null) {
      this.debugContainer = new Container();
      this.debugContainer.zIndex = 100;
      this.layersContainer.addChild(this.debugContainer);
    }
    this.deleteWalls();

    Object.entries(this.map.walls).forEach(([position], index) => {
      if (!this.debugGraphics[index]) {
        this.debugGraphics[index] = new Graphics();
        this.debugGraphics[index].blendMode = BLEND_MODES.DARKEN;
        this.debugContainer.addChild(this.debugGraphics[index]);
      }

      const [x, y] = position.split(',').map((s) => Number(s));

      const wallX = x - cameraPerson.x - withGrid(CONFIG.OFFSET.x);
      const wallY = y - cameraPerson.y - withGrid(CONFIG.OFFSET.y);

      this.debugGraphics[index].beginFill(0xde3249);
      this.debugGraphics[index].lineStyle(1, 0xfeeb77, 1);
      this.debugGraphics[index].drawRect(wallX, wallY, CONFIG.PIXEL_SIZE, CONFIG.PIXEL_SIZE);
      this.debugGraphics[index].endFill();
    });
  }

  bindActionInput() {
    new Keyboard('Enter', () => {
      /* Is there a person here to talk to?
      this.map.checkForActionCutscene(); */
    });
    new Keyboard('Escape', () => {
      if (!this.map.isCutscenePlaying) {
        // this.map.startCutscene([{ type: "pause" }]);
      }
      console.debug('Escaped clicked');
      this.app.ticker.remove(this.gameLoopReference);
    });

    new Keyboard('BracketRight', () => {
      this.debug = !this.debug;
      DebugHud.shared.toggle();
      if (!this.debug) {
        this.deleteWalls();
      }
    });
  }

  bindHeroPositionCheck() {
    document.addEventListener('PersonWalkingComplete', (e) => {
      if (e.detail.whoId === 'hero') {
        // Hero's position has changed
        // this.map.checkForFootstepCutscene();
        // this.updateInteractableLayers(this.map.gameObjects.hero, false);
      }
    });
  }
}
