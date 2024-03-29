import { AnimatedSprite, Assets } from 'pixi.js';
import { CONFIG } from '../config';
import { emitEvent, nextPosition, withGrid } from '../utils';
import { PlayerKeyboard } from '../components/PlayerKeyboard';
import { Tooltip } from '../lib/Tooltip';
import { translate } from '../lib/Translator';
import { STORAGE_KEYS, getStoredValue, setStoredValue } from '../lib/Storage';
import { getAsset } from '../lib/AssetLoader';

export class Player {
  keyboard;
  constructor(config) {
    this.id = config.id;
    this.movingProgressRemaining = 0;
    this.intentPosition = null;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || 'down';
    this.sprite = null;
    this.isStanding = false;
    this.isMounted = false;
    this.container = config.container;

    this.keyboard = new PlayerKeyboard();
    this.keyboard.init();

    const movementSpeed = 1;

    this.directionUpdate = {
      up: ['y', -movementSpeed],
      down: ['y', movementSpeed],
      left: ['x', -movementSpeed],
      right: ['x', movementSpeed]
    };

    this.standBehaviorTimeout = 100;
    this.index = config.index || 100;

    this.possibleAnimations = [
      'idle-down',
      'idle-right',
      'idle-up',
      'idle-left',
      'walk-down',
      'walk-right',
      'walk-up',
      'walk-left'
    ];
    this.animationPrefix = 'nerd-';

    this.animationsResources = Assets.cache.get(getAsset(CONFIG.textures.hero.config))?.data.animations;

    this.animations = {};
    this.currentAnimation = config.currentAnimation || `idle-${this.direction}`;
    this.possibleAnimations.forEach((anim) => {
      this.animations[anim] = AnimatedSprite.fromFrames(this.animationsResources[`${this.animationPrefix}${anim}`]);
    });

    this.animationFrameLimit = config.animationFrameLimit || CONFIG.animationFrameLimit;

    // These happen once on map startup.
    this.behaviorLoop = config.behaviorLoop || [];
    this.behaviorLoopIndex = 0;
    this.talking = config.talking || [];
    this.retryTimeout = null;
  }

  mount(map) {
    console.debug(`Mounting ${this.id}`);
    this.map = map;
    this.sprite = this.animations[this.currentAnimation];
    this.sprite.anchor.set(0.5);
    this.sprite.zIndex = 5;

    this.makeInteractable();

    this.sprite.animationSpeed = 1 / 4;
    this.sprite.loop = false;
    this.container.addChild(this.sprite);

    // this.saveInterval = setInterval(() => {
    //   const hero = this.map.gameObjects.hero;
    //   const playerState = {
    //     x: hero.x - (hero.x % CONFIG.PIXEL_SIZE),
    //     y: hero.y - (hero.y % CONFIG.PIXEL_SIZE),
    //     direction: hero.direction
    //   };
    //   setStoredValue(STORAGE_KEYS.player, playerState);
    // }, 5000);

    this.isMounted = true;
    this.sprite.play();
  }

  unmount() {
    // clearTimeout(this.saveInterval);
    this.keyboard?.dispose();
    this.isMounted = false;
    this.sprite.stop();
    this.sprite.parent.removeChild(this.sprite);
  }

  update(cameraPerson) {
    const x = this.x - cameraPerson.x - withGrid(CONFIG.OFFSET.x) + 8;
    const y = this.y - cameraPerson.y - withGrid(CONFIG.OFFSET.y) + 8;

    this.sprite.position.set(x, y);

    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
    } else {
      if (!this.map.isCutscenePlaying && this.keyboard.direction) {
        this.startBehavior(this.map, {
          type: 'walk',
          direction: this.keyboard.direction
        });
      }
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

      tooltip.showMessage(translate(this.id).replace('{0}', getStoredValue(STORAGE_KEYS.username), '').trim());
    });

    this.sprite.on('pointerleave', () => {
      this.sprite.alpha = 1;
      tooltip.hide();
    });
  }

  startBehavior(map, behavior) {
    if (!this.isMounted) {
      return;
    }

    this.direction = behavior.direction;
    if (behavior.type === 'walk') {
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
      this.updateAnimationState();
    }

    if (behavior.type === 'stand') {
      this.isStanding = true;

      if (this.standBehaviorTimeout) {
        clearTimeout(this.standBehaviorTimeout);
        console.debug('xlear');
      }
      this.standBehaviorTimeout = setTimeout(() => {
        emitEvent('PersonStandComplete', {
          whoId: this.id
        });
        this.isStanding = false;
      }, behavior.time);
      this.updateAnimationState();
    }
  }

  updatePosition() {
    const [property, change] = this.directionUpdate[this.direction];
    this[property] += change;
    this.movingProgressRemaining -= 1;

    if (this.movingProgressRemaining <= 0) {
      this.intentPosition = null;

      this.currentAnimation = 'idle-' + this.direction;
      this.updateAnimationState();
      const state = {
        x: this.x,
        y: this.y,
        direction: this.direction
      };
      setStoredValue(STORAGE_KEYS.player, state);
      emitEvent('PersonWalkingComplete', {
        whoId: this.id,
        ...state
      });
    }
  }

  updateAnimationState() {
    if (this.sprite.playing || this.sprite.destroyed) return;

    if (this.movingProgressRemaining === 0) this.currentAnimation = 'idle-' + this.direction;

    this.sprite.textures = this.animations[this.currentAnimation].textures;

    if (this.movingProgressRemaining > 0) this.sprite.play();
  }
}
