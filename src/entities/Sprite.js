import { withGrid } from "../utils";
import { Sprite as PIXISprite } from "pixi.js";
export class Sprite {
  constructor(config) {
    //Set up the image

    this.image = PIXISprite.from(config.src);
    // TODO: Check loading
    this.isLoaded = true;

    this.useShadow = true; //config.useShadow || false;
    if (this.useShadow) {
      this.shadow = PIXISprite.from("/assets/shadow.png");
      this.isShadowLoaded = true;
    }

    //Configure Animation & Initial State
    this.animations = config.animations || {
      "idle-down": [[0, 0]],
      "idle-right": [[0, 1]],
      "idle-up": [[0, 2]],
      "idle-left": [[0, 3]],
      "walk-down": [
        [1, 0],
        [0, 0],
        [3, 0],
        [0, 0],
      ],
      "walk-right": [
        [1, 1],
        [0, 1],
        [3, 1],
        [0, 1],
      ],
      "walk-up": [
        [1, 2],
        [0, 2],
        [3, 2],
        [0, 2],
      ],
      "walk-left": [
        [1, 3],
        [0, 3],
        [3, 3],
        [0, 3],
      ],
    };
    this.currentAnimation = config.currentAnimation || "idle-down";
    this.currentAnimationFrame = 0;

    this.animationFrameLimit = config.animationFrameLimit || 8;
    this.animationFrameProgress = this.animationFrameLimit;

    //Reference the game object
    this.gameObject = config.gameObject;
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame];
  }

  setAnimation(key) {
    if (this.currentAnimation !== key) {
      this.currentAnimation = key;
      this.currentAnimationFrame = 0;
      this.animationFrameProgress = this.animationFrameLimit;
    }
  }

  updateAnimationProgress() {
    //Downtick frame progress
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1;
      return;
    }

    //Reset the counter
    this.animationFrameProgress = this.animationFrameLimit;
    this.currentAnimationFrame += 1;

    if (this.frame === undefined) {
      this.currentAnimationFrame = 0;
    }
  }

  draw(app, cameraPerson) {
    const x = this.gameObject.x - 8 + withGrid(10.5) - cameraPerson.x;
    const y = this.gameObject.y - 18 + withGrid(6) - cameraPerson.y;

    this.shadow.x = x;
    this.shadow.y = y;

    this.isShadowLoaded && app.stage.addChild(this.shadow);

    const [frameX, frameY] = this.frame;

    if (this.isLoaded) {
      // this.image.x = x;
      // this.image.y = y;

      this.image.position = { x, y };

      this.image.width = frameX * 32;
      this.image.height = frameY * 32;

      app.stage.addChild(
        this.image
        // frameX * 32,
        // frameY * 32,
        // 32,
        // 32,
        // x,
        // y,
        // 32,
        // 32
      );
    }

    this.updateAnimationProgress();
  }
}
