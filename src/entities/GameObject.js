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
    this.container = config.container;
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

    this.sprite.on('pointerenter', (e) => {
      this.sprite.alpha = 0.5;
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
