import { AnimatedSprite, Assets, Sprite } from 'pixi.js';
import { CONFIG, getAsset } from '../config';
import { emitEvent, nextPosition, withGrid } from '../utils';
import { GameEvent } from './GameEvent';
import { PlayerKeyboard } from '../components/PlayerKeyboard';
import { getCurrentLevel } from '../gameState';
import { AssetLoader } from '../lib/AssetLoader';
import { Tooltip } from '../lib/Tooltip';
import { Translator } from '../lib/Translator';
import { Storage } from '../lib/Storage';

export class Player {
  constructor(config) {
    this.assetLoader = new AssetLoader();

    this.id = config.id;
    this.movingProgressRemaining = 0;
    this.intentPosition = null; // [x,y]
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || 'down';
    this.sprite = null;

    this.keyboard = new PlayerKeyboard();
    this.keyboard.init();
    this.isStanding = true;

    const movementSpeed = 1;

    this.directionUpdate = {
      up: ['y', -movementSpeed],
      down: ['y', movementSpeed],
      left: ['x', -movementSpeed],
      right: ['x', movementSpeed]
    };

    this.standBehaviorTimeout = 100;
    this.index = config.index || 100;

    this.animationsMap = {
      'idle-down': 'hero-idle-down',
      'idle-right': 'hero-idle-right',
      'idle-up': 'hero-idle-up',
      'idle-left': 'hero-idle-left',
      'walk-down': 'hero-walk-down',
      'walk-right': 'hero-walk-right',
      'walk-up': 'hero-walk-up',
      'walk-left': 'hero-walk-left'
    };

    this.animationsResources = Assets.cache.get(
      this.assetLoader.getAsset(CONFIG.textures.hero.config)
    )?.data.animations;
    this.animations = {};
    this.currentAnimation = config.currentAnimation || `idle-${this.direction}`;
    Object.values(this.animationsMap).forEach((animation) => {
      this.animations[animation] = AnimatedSprite.fromFrames(this.animationsResources[animation]);
    });

    this.animationFrameLimit = config.animationFrameLimit || CONFIG.animationFrameLimit;

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
    console.debug(`Mounting ${this.id}`);
    this.map = map;
    this.sprite = this.animations[this.animationsMap[this.currentAnimation]];
    this.sprite.anchor.set(0.5);
    this.sprite.zIndex = 5;

    this.makeInteractable();
    this.sprite.animationSpeed = 1 / 4;
    this.sprite.loop = false;
    this.container.addChild(this.sprite);

    this.isMounted = true;
    this.sprite.play();
  }

  update(map, cameraPerson) {
    const x = this.x - cameraPerson.x - withGrid(CONFIG.OFFSET.x) + 8;
    const y = this.y - cameraPerson.y - withGrid(CONFIG.OFFSET.y) + 8;

    this.sprite.position.set(x, y);

    if (this.movingProgressRemaining > 0) {
      this.updatePosition(cameraPerson);
    } else {
      // We're keyboard ready and have an arrow pressed
      if (!map.isCutscenePlaying && this.keyboard.direction) {
        this.startBehavior(map, {
          type: 'walk',
          direction: this.keyboard.direction
        });
      }
      this.updateAnimationState();
    }
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

  async doBehaviorEvent(map) {
    // Don't do anything if I don't have config to do anything
    if (this.behaviorLoop.length === 0) {
      return;
    }

    if (map.isCutscenePlaying) {
      console.log('will retry', this.id);
      if (this.retryTimeout) {
        clearTimeout(this.retryTimeout);
      }
      this.retryTimeout = setTimeout(() => {
        this.doBehaviorEvent(map);
      }, 1000);
      return;
    }

    // Setting up our event with relevant info
    const eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
    eventConfig.who = this.id;

    // Create an event instance out of our next event config
    const eventHandler = new GameEvent({ map, event: eventConfig });
    await eventHandler.init();

    // Setting the next event to fire
    this.behaviorLoopIndex += 1;
    if (this.behaviorLoopIndex === this.behaviorLoop.length) {
      this.behaviorLoopIndex = 0;
    }

    // Do it again!
    this.doBehaviorEvent(map);
  }

  startBehavior(map, behavior) {
    if (!this.isMounted) {
      return;
    }

    // Set character direction to whatever behavior has
    this.direction = behavior.direction;
    if (behavior.type === 'walk') {
      // Stop here if space is not free

      const isSpaceTaken = map.isSpaceTaken(this.x, this.y, this.direction);
      this.currentAnimation = 'walk-' + this.direction;

      if (isSpaceTaken) {
        behavior.retry &&
          setTimeout(() => {
            this.startBehavior(map, behavior);
          }, 100);
        return;
      }

      // Ready to walk!
      this.movingProgressRemaining = CONFIG.PIXEL_SIZE;
      this.isStanding = false;

      // Add next position intent
      const intentPosition = nextPosition(this.x, this.y, this.direction);
      this.intentPosition = [intentPosition.x, intentPosition.y];
    }
  }

  updatePosition(cameraPerson) {
    const [property, change] = this.directionUpdate[this.direction];
    this[property] += change;
    this.movingProgressRemaining -= 1;

    if (this.movingProgressRemaining <= 0) {
      // We finished the walk!
      this.intentPosition = null;
      // this.sprite.playing = false;

      this.currentAnimation = 'idle-' + this.direction;

      emitEvent('PersonWalkingComplete', {
        whoId: this.id
      });

      const state = {
        x: this.x,
        y: this.y,
        direction: this.direction
      };
      Storage.set(Storage.STORAGE_KEYS.player, state);
    }
  }

  updateAnimationState() {
    if (this.sprite.playing) return;
    const nextAnimation = this.animationsMap[this.currentAnimation]; //  this.movingProgressRemaining > 0 ? this.currentAnimation : this.animationsMap["idle-" + this.direction];
    this.sprite.textures = this.animations[nextAnimation].textures;

    if (this.movingProgressRemaining > 0) {
      this.sprite.play();
    }
  }
}
