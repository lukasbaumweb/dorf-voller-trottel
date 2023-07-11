import { Application, BLEND_MODES, Container, Graphics } from 'pixi.js';

import { Map } from './Map';
import { withGrid } from '../utils';
import { Keyboard } from '../components/Keyboard';
import { CONFIG } from '../config';

import { DebugHud } from '../lib/DebugHud';
import App from '../components/App';

const GLOBAL_KEY = '_world';

export class World {
  DOMGameContainer = null;

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

    this.app = new App().getInstance()._appInstance;

    this.layersContainer = new Container();
    this.layersContainer.sortableChildren = true;
    this.app.stage.addChild(this.layersContainer);

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
    }
    +Object.values(this.map.gameObjects).forEach((object) => {
      object.update(this.map, cameraPerson);
    });

    Object.values(this.map.markerObjects).forEach((object) => {
      object.update(this.map, cameraPerson);
    });
  }

  bindActionInput() {
    new Keyboard('Enter', () => {
      this.map.checkForActionCutscene();
    });

    new Keyboard('Escape', () => {
      if (this.map.isCutscenePlaying) {
        this.map.startCutscene([{ type: 'pause' }]);
      }
      console.debug('Escaped clicked');
    });

    new Keyboard('BracketRight', () => {
      this.debug = !this.debug;
      DebugHud.shared.toggle();
    });

    new Keyboard('Backslash', () => {
      console.debug('Game stopped completly!');
      this.app.ticker.remove(this.gameLoopReference);
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
