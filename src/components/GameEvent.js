import { CONFIG } from '../config';
import { Storage } from '../lib/Storage';
import { oppositeDirection } from '../utils';
import { SceneTransition } from './SceneTransition';
import { TextMessage } from './TextMessage';

export class GameEvent {
  constructor({ map, event }) {
    this.map = map;
    this.event = event;
  }

  stand(resolve) {
    const who = this.map.gameObjects[this.event.who];
    who.startBehavior(
      {
        map: this.map
      },
      {
        type: 'stand',
        direction: this.event.direction,
        time: this.event.time
      }
    );

    // Set up a handler to complete when correct person is done walking, then resolve the event
    const completeHandler = (e) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener('PersonStandComplete', completeHandler);
        resolve();
      }
    };
    document.addEventListener('PersonStandComplete', completeHandler);
  }

  textMessage(resolve) {
    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = oppositeDirection(this.map.gameObjects.hero.direction);
    }

    const message = new TextMessage({
      text: this.event.text,
      onComplete: () => resolve()
    });
    message.init();
  }

  changeMap(resolve) {
    // Deactivate old objects
    Object.values(this.map.gameObjects).forEach((obj) => {
      if (obj.id !== 'hero') obj.unmount();
    });

    Object.values(this.map.markerObjects).forEach((obj) => {
      obj.unmount();
    });
    this.map.unmount();

    const sceneTransition = new SceneTransition();
    sceneTransition.init(document.querySelector('.game-wrapper'), () => {
      this.map.initMap(CONFIG.levels[this.event.transitionToMap], {
        x: this.event.x,
        y: this.event.y,
        direction: this.event.direction
      });
      resolve();
      sceneTransition.fadeOut();
    });
  }

  pause(resolve) {
    this.map.isPaused = true;
  }

  addStoryFlag(resolve) {
    Storage.update(Storage.STORAGE_KEYS.playerStoryProgress, { [this.event.flag]: true });
    resolve();
  }

  // inventory(resolve) {
  //   const menu = new Inventory({
  //     onComplete: () => {
  //       resolve();
  //     }
  //   });
  //   menu.init(document.querySelector('.game-container'));
  // }

  init() {
    return new Promise((resolve) => {
      this[this.event.type](resolve);
    });
  }
}
