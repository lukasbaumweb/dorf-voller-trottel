export class Player {
  /**
   * Position x,y
   */
  position = [];
  constructor({ position }) {
    if (position && position.length > 0) this.position = position;
  }
}
