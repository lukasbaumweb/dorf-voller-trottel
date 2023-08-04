import { TextMessage } from './components/TextMessage';
import { CONFIG } from './config';
import { getPlayerState } from './gameState';

const withGrid = (n) => {
  return n * CONFIG.PIXEL_SIZE;
};

const asGridCoord = (x, y) => {
  return `${withGrid(x)},${withGrid(y)}`;
};

const nextPosition = (initialX, initialY, direction) => {
  let x = initialX;
  let y = initialY;
  const size = CONFIG.PIXEL_SIZE;
  if (direction === 'left') {
    x -= size;
  } else if (direction === 'right') {
    x += size;
  } else if (direction === 'up') {
    y -= size;
  } else if (direction === 'down') {
    y += size;
  }
  return { x, y };
};

const oppositeDirection = (direction) => {
  if (direction === 'left') return 'right';
  if (direction === 'right') return 'left';
  if (direction === 'up') return 'down';
  return 'up';
};

const wait = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

const randomFromArray = (array) => array[Math.floor(Math.random() * array.length)];

const emitEvent = (name, detail) => {
  const event = new window.CustomEvent(name, {
    detail
  });
  document.dispatchEvent(event);
};

const isNullOrUndefined = (value) => {
  const isNull = value === null;
  const isNullString = value === 'null';
  const isUndefined = value === undefined;
  const isUndefinedString = value === 'undefined';

  return isNull || isNullString || isUndefined || isUndefinedString;
};

const makeid = (length = 5) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

const runMonolog = (messages = []) => {
  if (messages.length === 0) return;
  new TextMessage({
    text: messages[0],
    onComplete: () => {
      runMonolog(messages.slice(1));
    }
  }).init();
};

const getCurrenTask = () => {
  const storyProgress = getPlayerState();
  const firstUndoneTask = Object.entries(storyProgress).find(([key, state]) => !state);
  return firstUndoneTask.at(0);
};

export {
  withGrid,
  asGridCoord,
  emitEvent,
  nextPosition,
  oppositeDirection,
  randomFromArray,
  wait,
  isNullOrUndefined,
  makeid,
  runMonolog,
  getCurrenTask
};
