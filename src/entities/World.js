import { Application, BLEND_MODES, Container, Graphics, Text, TextStyle } from 'pixi.js';

import { Map } from './Map';
import { asGridCoord, withGrid } from '../utils';
import { Keyboard } from '../components/Keyboard';
import { CONFIG } from '../config';
import { getCurrentLevel } from '../gameState';

export class World {
  constructor() {
    // debug variables
    this.debug = false;
    this.debugContainer = null;
    this.debugGraphics = [];
    this.runOnce = false;
    this.debugTexts = [];
  }

  init() {
    this.app = new Application({
      background: '#272d37',
      width: 352,
      height: 198
    });
    this.layersContainer = new Container();
    this.layersContainer.sortableChildren = true;
    this.app.stage.addChild(this.layersContainer);

    const DOMGameContainer = document.createElement('div');
    DOMGameContainer.sortableChildren = true;
    DOMGameContainer.classList.add('game-wrapper');
    DOMGameContainer.appendChild(this.app.view);
    document.body.appendChild(DOMGameContainer);

    this.bindActionInput();
    this.bindHeroPositionCheck();

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

    //TODO:
    // this.interactableLayers = this.map.getInteractableLayers();

    // init gameloop
    this.app.ticker.add(this.gameLoopReference);
  }

  gameLoopReference = (delta) => this.gameloop(this, delta);

  updateInteractableLayers(target, isTransparent) {
    for (let i = 0; i < this.interactableLayers.length; i++) {
      const layer = this.interactableLayers[i];

      const x = target.x / 16;
      const y = target.y / 16;
      const hit = layer.tiles[`${x},${y}`];
      if (hit && isTransparent) {
        Object.values(layer.tiles).forEach((tile) => {
          tile.sprite.alpha = 0.5;

          // tile.sprite.alpha = 1;
        });
      } else if (!isTransparent) {
        Object.values(layer.tiles).forEach((tile) => {
          tile.sprite.alpha = 1;

          // tile.sprite.alpha = 1;
        });
      }
    }
  }

  gameloop(ctx, delta) {
    const cameraPerson = this.map.gameObjects.hero;

    this.map.update(cameraPerson);
    //TODO:

    // this.updateInteractableLayers(this.map.gameObjects.hero, true);

    if (this.debug) {
      window._hud.show();

      this.drawWalls(cameraPerson);
    }

    Object.values(this.map.gameObjects).forEach((object) => {
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
      window._hud.toggle();
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
