import { Container } from 'pixi.js';

import { Map } from './Map';
import { Keyboard } from '../components/Keyboard';
import { CONFIG } from '../config';

import { DebugHud } from '../lib/DebugHud';

export class World {
  DOMGameContainer = null;
  isMounted = false;
  timer;

  debounce = (callback, timeout = 300) => {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      callback();
    }, timeout);
  };

  mount(appInstance) {
    if (this.isMounted) return;

    this.app = appInstance;

    this.layersContainer = new Container();
    this.layersContainer.sortableChildren = true;
    this.app.stage.addChild(this.layersContainer);

    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.isMounted = true;
  }

  init(appInstance) {
    this.mount(appInstance);

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
    Object.values(this.map.gameObjects).forEach((object) => {
      object.update(this.map, cameraPerson);
    });

    Object.values(this.map.markerObjects).forEach((object) => {
      object.update(this.map, cameraPerson);
    });
  }

  bindActionInput() {
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

    new Keyboard('Enter', () => {
      this.map.checkForActionCutscene();
    });

    new Keyboard('KeyP', () => {
      console.debug('Game stopped completly!');
      this.app.ticker.remove(this.gameLoopReference);
    });
  }

  bindHeroPositionCheck() {
    document.addEventListener('PersonWalkingComplete', (e) => {
      // Hero's position has changed
      if (e.detail.whoId === 'hero') {
        this.debounce(() => this.map.checkForMarkers(), 300);
      }
    });
  }
}
