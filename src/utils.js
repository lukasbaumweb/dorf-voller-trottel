import { CONFIG } from './config';

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
  if (direction === 'left') {
    return 'right';
  }
  if (direction === 'right') {
    return 'left';
  }
  if (direction === 'up') {
    return 'down';
  }
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
  const event = new CustomEvent(name, {
    detail
  });
  document.dispatchEvent(event);
};

export { withGrid, asGridCoord, emitEvent, nextPosition, oppositeDirection, randomFromArray, wait };
