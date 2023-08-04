import { reject } from 'lodash';
import { CONFIG } from '../config';
import { STORAGE_KEYS, getStoredValue, setStoredValue } from '../lib/Storage';
import { isNullOrUndefined, oppositeDirection } from '../utils';
import { SceneTransition } from './SceneTransition';
import { TextMessage } from './TextMessage';
import { setPlayerState } from '../gameState';

export class GameEvent {
  constructor({ map, event }) {
    this.map = map;
    this.event = event;
  }

  stand(resolve) {
    const who = this.map.gameObjects[this.event.who];
    if (!who) {
      reject();
      return;
    }
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

  walk(resolve) {
    const who = this.map.gameObjects[this.event.who];
    if (!who) {
      reject();
      return;
    }
    who.startBehavior(
      {
        map: this.map
      },
      {
        type: 'walk',
        direction: this.event.direction,
        retry: true
      }
    );

    const completeHandler = (e) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener('PersonWalkingComplete', completeHandler);
        resolve();
      }
    };
    document.addEventListener('PersonWalkingComplete', completeHandler);
  }

  textMessage(resolve) {
    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = oppositeDirection(this.map.gameObjects.hero.direction);
    }

    const message = new TextMessage({
      text: this.event.text.replace('<NAME>', getStoredValue(STORAGE_KEYS.username, '')),
      onComplete: () => resolve()
    });
    message.init();
  }

  changeMap(resolve) {
    if (isNullOrUndefined(this.event.transitionToMap)) {
      console.warn('Cannot change map because destination is not given');
      reject();
      return;
    }

    // Deactivate old objects
    this.map.unmount();

    const sceneTransition = new SceneTransition();

    setStoredValue(STORAGE_KEYS.map, this.event.transitionToMap);
    setStoredValue(STORAGE_KEYS.player, {
      x: this.event.x,
      y: this.event.y,
      direction: this.event.direction
    });
    sceneTransition.init(document.querySelector('.game-wrapper'), async () => {
      await this.map.initMap(CONFIG.maps[this.event.transitionToMap]);
      resolve();
      sceneTransition.fadeOut();
    });
  }

  pause(resolve) {
    this.map.isPaused = true;
  }

  addStoryFlag(resolve) {
    setPlayerState(this.event.flag, true);
    const evt = new window.CustomEvent('renderQuests');
    document.dispatchEvent(evt);
    resolve();
  }

  init() {
    return new Promise((resolve) => {
      this[this.event.type](resolve);
    });
  }
}
