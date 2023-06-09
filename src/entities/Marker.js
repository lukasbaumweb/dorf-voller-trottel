import { AnimatedSprite, Assets, Sprite } from 'pixi.js';
import { CONFIG, getAsset } from '../config';
import { emitEvent, nextPosition, withGrid } from '../utils';
import { GameEvent } from './GameEvent';
import { PlayerKeyboard } from '../components/PlayerKeyboard';
import { getCurrentLevel } from '../gameState';
import { AssetLoader } from '../lib/AssetLoader';
import { Tooltip } from '../lib/Tooltip';
import { Translator } from '../lib/Translator';

export class Marker {
  constructor(config) {
    this.assetLoader = new AssetLoader();

    this.id = config.id;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.isBig = config.isBig;
    this.sprite = null;

    this.keyboard = new PlayerKeyboard();
    this.keyboard.init();
    this.isStanding = true;

    this.resource = Assets.cache.get(
      this.assetLoader.getAsset(config.isBig ? CONFIG.textures.bigMarker.config : CONFIG.textures.marker.config)
    );

    this.animationsResources = this.resource?.data.animations;
    this.animation = AnimatedSprite.fromFrames(this.resource._frameKeys);

    this.isMounted = false;
    this.sprite = null;
    this.container = config.container;

    // These happen once on map startup.
    this.behaviorLoop = config.behaviorLoop || [];
    this.behaviorLoopIndex = 0;
    this.talking = config.talking || [];
    this.retryTimeout = null;
  }

  mount(map) {
    console.debug(`Mounting ${this.id} ...`);
    this.map = map;
    this.sprite = this.animation;
    this.sprite.anchor.set(0.5);
    this.sprite.zIndex = 5;
    this.sprite.width = this.isBig ? CONFIG.PIXEL_SIZE * 2 : CONFIG.PIXEL_SIZE;
    this.sprite.height = CONFIG.PIXEL_SIZE;

    this.makeInteractable();
    this.sprite.animationSpeed = 1 / 8;
    this.sprite.loop = true;
    this.container.addChild(this.sprite);

    this.isMounted = true;
    this.sprite.play();
  }

  update(map, cameraPerson) {
    const x = this.x - cameraPerson.x - withGrid(CONFIG.OFFSET.x);
    const y = this.y - cameraPerson.y - withGrid(CONFIG.OFFSET.y);

    this.sprite.position.set(x, y);
  }

  makeInteractable() {
    // Shows hand cursor
    this.sprite.buttonMode = true;
    this.sprite.eventMode = 'static';

    const tooltip = new Tooltip();
    tooltip.init();

    this.sprite.on('pointerenter', (e) => {
      this.sprite.alpha = 0.5;

      tooltip.showMessage(Translator.translate(this.id));
    });

    this.sprite.on('pointerleave', () => {
      this.sprite.alpha = 1;
      tooltip.hide();
    });
  }
}
