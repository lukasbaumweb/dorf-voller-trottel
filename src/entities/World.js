import { Container } from 'pixi.js';

import { Map } from './Map';
import { Keyboard } from '../components/Keyboard';

import { DebugHud } from '../lib/DebugHud';
import { getGameBlocked } from '../utils';

export class World {
  DOMGameContainer = null;
  isMounted = false;
  timer;

  tickRate = 14; // 1000/14 = 71 frames per second
  tickTime = 0;

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
    this.start();
  }

  async start() {
    this.map = new Map({ world: this, layersContainer: this.layersContainer });

    await this.map.initMap(this.layersContainer);

    // init gameloop
    this.app.ticker.add(this.gameLoopReference);
  }

  gameLoopReference = (delta) => {
    const timeNow = new Date().getTime();
    const timeDiff = timeNow - this.tickTime;
    if (timeDiff < this.tickRate) return;

    this.tickTime = timeNow;

    this.gameloop(this, delta);
  };

  gameloop(ctx, delta) {
    const cameraPerson = this.map.gameObjects.hero;

    this.map.update(cameraPerson);

    if (this.debug) {
      DebugHud.shared.show();
    }
    Object.values(this.map.gameObjects).forEach((object) => {
      object.update(cameraPerson);
    });

    Object.values(this.map.markers).forEach((object) => {
      object.update(cameraPerson);
    });

    Object.values(this.map.portals).forEach((object) => {
      object.update(cameraPerson);
    });

    Object.values(this.map.items).forEach((object) => {
      object.update(cameraPerson);
    });
  }

  bindActionInput() {
    new Keyboard('BracketRight', () => {
      this.debug = !this.debug;
      DebugHud.shared.toggle();
    });

    new Keyboard('Enter', () => {
      if (this.map.isMounted && !getGameBlocked()) {
        this.map.checkForActionCutscene();
        this.map.checkForItems();
      }
    });

    new Keyboard('F10', () => {
      if (this.map.isMounted) {
        console.debug('Game stopped completly!');
        this.map.unmount();
        this.app.ticker.remove(this.gameLoopReference);
      }
    });
  }

  bindHeroPositionCheck() {
    document.addEventListener('PersonWalkingComplete', (e) => {
      // Hero's position has changed
      if (e.detail.whoId === 'hero') {
        this.debounce(() => this.map.checkForPortals(), 300);
      }
    });
  }
}
