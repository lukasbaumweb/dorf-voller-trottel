import { AnimatedSprite, Assets } from 'pixi.js';
import { CONFIG } from '../config';
import { emitEvent, nextPosition, withGrid } from '../utils';
import { GameEvent } from '../components/GameEvent';

import { getAsset } from '../lib/AssetLoader';
import { Tooltip } from '../lib/Tooltip';
import { translate } from '../lib/Translator';

export class Character {
  constructor(config) {
    this.id = config.id;
    this.movingProgressRemaining = 0;
    this.intentPosition = null;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || 'down';
    this.isMounted = false;
    this.sprite = null;
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

    this.animationsResources = Assets.cache.get(getAsset(config.config))?.data.animations;

    this.animations = {};
    this.currentAnimation = config.currentAnimation || `idle-${this.direction}`;
    this.possibleAnimations.forEach((anim) => {
      this.animations[anim] = AnimatedSprite.fromFrames(this.animationsResources[config.id + '-' + anim]);
    });

    this.animationFrameLimit = config.animationFrameLimit || CONFIG.animationFrameLimit;

    this.container = config.container;

    // These happen once on map startup.
    this.behaviorLoop = config.behaviorLoop || [];
    this.behaviorLoopIndex = 0;
    this.isDoingBehavior = false;
    this.talking = config.talking || [];
    this.retryTimeout = null;
  }

  mount(map) {
    if (this.isMounted) return;

    console.debug(`Mounting Character: ${this.id}`);
    this.map = map;
    this.sprite = this.animations[this.currentAnimation];
    this.sprite.anchor.set(0.5);
    this.sprite.zIndex = 5;

    this.makeInteractable();
    this.sprite.animationSpeed = 1 / 4;
    this.sprite.loop = false;
    this.container.addChild(this.sprite);

    this.isMounted = true;
    this.sprite.play();
  }

  unmount() {
    clearTimeout(this.retryTimeout);
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
      this.updatePosition(cameraPerson);
    } else {
      if (!this.map.isCutscenePlaying) {
        this.doBehaviorEvent(this.map, this.behaviorLoop[this.behaviorLoopIndex]);
      }
      this.updateAnimationState();
    }
  }

  makeInteractable() {
    // Shows hand cursor
    this.sprite.eventMode = 'static';

    const tooltip = new Tooltip();
    tooltip.init();

    this.sprite.on('pointerenter', (e) => {
      this.sprite.alpha = 0.8;

      tooltip.showMessage(translate(this.id));
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

    if (map.isCutscenePlaying || this.isDoingBehavior) {
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
    this.isDoingBehavior = true;
    await eventHandler.init();

    // Setting the next event to fire
    this.behaviorLoopIndex += 1;
    if (this.behaviorLoopIndex === this.behaviorLoop.length) {
      this.behaviorLoopIndex = 0;
    }

    this.isDoingBehavior = false;
    // Do it again!
    this.doBehaviorEvent(map);
  }

  startBehavior(state, behavior) {
    if (!this.isMounted) {
      return;
    }

    this.direction = behavior.direction;

    if (behavior.type === 'walk') {
      const isSpaceTaken = state.map.isSpaceTaken(this.x, this.y, this.direction);
      this.currentAnimation = 'walk-' + this.direction;

      if (isSpaceTaken) {
        behavior.retry &&
          setTimeout(() => {
            this.startBehavior(state, behavior);
          }, 100);
        return;
      }

      this.movingProgressRemaining = CONFIG.PIXEL_SIZE;

      const intentPosition = nextPosition(this.x, this.y, this.direction);
      this.intentPosition = [intentPosition.x, intentPosition.y];
    }

    if (behavior.type === 'stand') {
      this.isStanding = true;

      if (this.standBehaviorTimeout) {
        clearTimeout(this.standBehaviorTimeout);
      }
      this.standBehaviorTimeout = setTimeout(() => {
        emitEvent('PersonStandComplete', {
          whoId: this.id
        });
        this.isStanding = false;
      }, behavior.time);
    }
    this.updateAnimationState();
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
