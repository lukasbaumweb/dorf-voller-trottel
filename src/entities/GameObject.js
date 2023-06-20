import { AnimatedSprite } from 'pixi.js';
import { GameEvent } from './GameEvent';

export class GameObject {
  constructor(config) {
    this.id = null;
    this.isMounted = false;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || 'down';
    this.sprite = null;

    this.texture = config.texture;
    this.json = config.json;
    this.charactersContainer = config.charactersContainer;
    this.interactable = !!config.interactable;

    //These happen once on map startup.
    this.behaviorLoop = config.behaviorLoop || [];
    this.behaviorLoopIndex = 0;
    this.talking = config.talking || [];
    this.retryTimeout = null;
  }

  mount(map) {
    this.isMounted = true;

    //If we have a behavior, kick off after a short delay
    setTimeout(() => {
      this.doBehaviorEvent(map);
    }, 10);
  }

  update({ cameraPerson }, index) {
    const x = this.gameObject.x + withGrid(CONFIG.OFFSET.x) - cameraPerson.x - 8;
    const y = this.gameObject.y + withGrid(CONFIG.OFFSET.y) - cameraPerson.y - 8;

    if (!this.animationPlaying) {
      this.sprite = AnimatedSprite.fromFrames(this.loadedAnimations[this.animations[this.currentAnimation]]);
      this.sprite.anchor.set(0.5);
      this.sprite.zIndex = index;
      this.sprite.x = x;
      this.sprite.y = y;
      this.sprite.animationSpeed = 1 / 6;
      this.sprite.loop = false;
      this.sprite.play();
      this.animationPlaying = true;

      this.sprite.onComplete = () => {
        // this.charactersContainer.removeChild(this.sprite);
        // this.sprite.destroy();
        // this.sprite = null;
        this.animationPlaying = false;
      };
      this.sprite.eventMode = 'static';
      this.charactersContainer.addChild(this.sprite);
      this.animationPlaying = false;
      this.makeInteractable();
    }

    this.sprite.position.set(x, y);
  }

  makeInteractable() {
    // Shows hand cursor
    this.sprite.buttonMode = true;

    this.sprite.on('pointerenter', (e) => {
      this.sprite.alpha = 0.5;
      console.log(e);
    });

    this.sprite.on('pointerleave', (e) => {
      this.sprite.alpha = 1;
    });
  }

  async doBehaviorEvent(map) {
    //Don't do anything if I don't have config to do anything
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

    //Setting up our event with relevant info
    let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
    eventConfig.who = this.id;

    //Create an event instance out of our next event config
    const eventHandler = new GameEvent({ map, event: eventConfig });
    await eventHandler.init();

    //Setting the next event to fire
    this.behaviorLoopIndex += 1;
    if (this.behaviorLoopIndex === this.behaviorLoop.length) {
      this.behaviorLoopIndex = 0;
    }

    //Do it again!
    this.doBehaviorEvent(map);
  }
}
