import { AnimatedSprite, Assets } from 'pixi.js';
import { CONFIG } from '../config';
import { withGrid } from '../utils';
import { PlayerKeyboard } from '../components/PlayerKeyboard';

import { Tooltip } from '../lib/Tooltip';
import { translate } from '../lib/Translator';
import { getAsset } from '../lib/AssetLoader';
import { Modal } from '../components/Modal';
import { checkDisqualifiedFlags, checkStoryFlag } from '../gameState';
import { TextMessage } from '../components/TextMessage';

export class Marker {
  constructor(config) {
    console.debug('MarkerConfig: ', config);
    this.id = config.id;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.transitionToMap = config.transitionToMap;

    this.sprite = null;
    this.showTooltip = !!config.showTooltip;
    this.clickable = !!config.clickable;
    this.showModalOnClick = !!config.showModalOnClick;
    this.modalContent = config.modalContent || null;
    this.title = config.title || '';

    this.required = config.required || null;
    this.disqualify = config.disqualify || null;
    this.description = config.description || '';

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
    if (this.isMounted) return;
    console.debug(`Mounting Marker: ${this.id} ...`);
    this.map = map;
    this.sprite = this.animation;
    this.sprite.zIndex = 5;
    this.sprite.width = CONFIG.PIXEL_SIZE;
    this.sprite.height = CONFIG.PIXEL_SIZE;

    this.makeInteractable(this.showTooltip, this.clickable);
    this.sprite.animationSpeed = 1 / 8;
    this.sprite.loop = true;
    this.container.addChild(this.sprite);

    this.isMounted = true;
    this.sprite.play();
  }

  update(cameraPerson) {
    const x = this.x - cameraPerson.x - withGrid(CONFIG.OFFSET.x);
    const y = this.y - cameraPerson.y - withGrid(CONFIG.OFFSET.y);

    if (!checkStoryFlag(this.required || []) && checkDisqualifiedFlags([...this.disqualify])) {
      this.sprite.visible = false;
    } else {
      this.sprite.visible = true;
    }

    this.sprite.position.set(x, y);
  }

  unmount() {
    this.isMounted = false;
    this.sprite.stop();
    this.sprite.parent.removeChild(this.sprite);
  }

  makeInteractable(showTooltip, clickable) {
    // Shows hand cursor
    this.sprite.buttonMode = true;
    this.sprite.eventMode = 'static';

    let tooltip;
    if (showTooltip) {
      tooltip = new Tooltip();
      tooltip.init();
    }

    this.sprite.on('pointerenter', () => {
      this.sprite.alpha = 0.5;
      showTooltip && tooltip.showMessage(translate(this.id));
    });

    this.modal = new Modal({
      modalContent: this.modalContent,
      title: this.title
    });
    this.modal.init();

    if (clickable) {
      this.sprite.on('click', () => {
        this.modal.show();
      });
    }

    this.sprite.on('pointerleave', (e) => {
      this.sprite.alpha = 1;
    });
  }

  showModal() {
    new TextMessage({
      text: this.description,
      onAcceptText: translate(this.onAcceptText) || translate('enter'),
      onComplete: () => {
        if (this.modal) {
          this.modal.show();
        }
      }
    }).init();
  }
}
