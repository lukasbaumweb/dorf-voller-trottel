import { Sprite } from 'pixi.js';
import { CONFIG } from '../config';
import { withGrid } from '../utils';
import { Tooltip } from '../lib/Tooltip';
import { translate } from '../lib/Translator';
import { Modal } from '../lib/Modal';

export class Item {
  constructor(config) {
    this.id = null;
    this.isMounted = false;
    this.x = config?.x || 0;
    this.y = config?.y || 0;
    this.sprite = null;

    this.texture = config.texture;
    this.json = config.json;
    this.container = config.container;
    this.interactable = !!config.interactable;
    this.showModalOnClick = !!config.showModalOnClick;
    this.modalContent = config.modalContent || null;

    // These happen once on map startup.
    this.behaviorLoop = config.behaviorLoop || [];
    this.behaviorLoopIndex = 0;
    this.talking = config.talking || [];
    this.retryTimeout = null;
  }

  mount(map) {
    console.debug(`Mounting Item: ${this.id}`);
    this.map = map;
    this.sprite = Sprite.from(this.texture);
    this.sprite.height = CONFIG.PIXEL_SIZE;
    this.sprite.width = CONFIG.PIXEL_SIZE;
    this.sprite.anchor.set(0.5);
    this.sprite.zIndex = 5;

    this.interactable && this.makeInteractable(true, this.showModalOnClick);
    this.container.addChild(this.sprite);

    this.isMounted = true;
  }

  unmount() {
    this.isMounted = false;
    this.sprite.parent.removeChild(this.sprite);
  }

  update(cameraPerson) {
    const x = this.x - cameraPerson.x - withGrid(CONFIG.OFFSET.x) + 8;
    const y = this.y - cameraPerson.y - withGrid(CONFIG.OFFSET.y) + 8;

    this.sprite.position.set(x, y);
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

    if (clickable) {
      const modal = new Modal({
        modalContent: this.modalContent
      });
      modal.init();
      this.sprite.on('click', () => {
        modal.show();
      });
    }

    this.sprite.on('pointerleave', (e) => {
      this.sprite.alpha = 1;
    });
  }
}
