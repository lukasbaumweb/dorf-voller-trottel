import * as PIXI from "pixi.js";

export class Tile {
  id = -1;
  sprite = null;
  position = [];
  constructor({ id, position, sprite }) {
    if (!id) throw Error("id required");
    this.id = id;
    this.sprite = sprite;
    this.position = position;
  }

  render() {
    const tile = PIXI.Sprite.from(this.sprite);
    window.app.stage.addChild(tile);
  }
}
