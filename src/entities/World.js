import { Container } from 'pixi.js';

import { Map } from './Map';
import { Keyboard } from '../components/Keyboard';

import { DebugHud } from '../lib/DebugHud';
import { getCurrentLevel } from '../gameState';

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

    // TODO: Load Level from storage
    const level = getCurrentLevel();
    this.start(level);
  }

  start(level) {
    this.map = new Map({ level, world: this, layersContainer: this.layersContainer });

    this.map.initMap(this.layersContainer);

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

    new Keyboard('KeyC', () => {
      this.map.unmount();
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
