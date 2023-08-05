import { AnimatedSprite, Assets } from 'pixi.js';
import { CONFIG } from '../config';
import { withGrid } from '../utils';
import { PlayerKeyboard } from '../components/PlayerKeyboard';

import { getAsset } from '../lib/AssetLoader';
import { checkDisqualifiedFlags, checkStoryFlag } from '../gameState';

export class Portal {
  constructor(config) {
    this.id = config.id;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.transitionToMap = config.transitionToMap;
    this.text = config.text;
    this.onAcceptText = config.onAcceptText;
    this.required = config.required || [];

    this.sprite = null;

    this.keyboard = new PlayerKeyboard();
    this.keyboard.init();
    this.isStanding = true;

    this.resource = Assets.cache.get(getAsset(CONFIG.textures.marker.config));

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
    if (this.isMounted || !this.transitionToMap) return;
    console.debug(`Mounting Portal: ${this.id} ...`);
    this.map = map;
    this.sprite = this.animation;
    this.sprite.zIndex = 5;
    this.sprite.width = CONFIG.PIXEL_SIZE;
    this.sprite.height = CONFIG.PIXEL_SIZE;

    this.sprite.animationSpeed = 1 / 8;
    this.sprite.loop = true;
    this.container.addChild(this.sprite);

    this.isMounted = true;
    this.sprite.play();
  }

  update(cameraPerson) {
    if (!this.isMounted) return;

    const x = this.x - cameraPerson.x - withGrid(CONFIG.OFFSET.x);
    const y = this.y - cameraPerson.y - withGrid(CONFIG.OFFSET.y);

    if (!checkStoryFlag(this.required || []) && checkDisqualifiedFlags(this.disqualify || [])) {
      this.sprite.visible = false;
    } else {
      this.sprite.visible = true;
    }
    this.sprite.position.set(x, y);
  }

  unmount() {
    this.isMounted = false;
    try {
      this.sprite?.stop();
    } catch (error) {
      console.error(error);
    }
    this.sprite?.parent.removeChild(this.sprite);
  }
}
