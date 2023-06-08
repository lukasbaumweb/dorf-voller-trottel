import { CONFIG } from "../config";
import { withGrid } from "../utils";
import { AnimatedSprite, Assets, Sprite as PIXISprite, Texture } from "pixi.js";
export class Sprite {
  constructor(config) {
    this.animations = {
      "idle-down": "hero/hero-idle-down",
      "idle-right": "hero/hero-idle-right",
      "idle-up": "hero/hero-idle-up",
      "idle-left": "hero/hero-idle-left",
      "walk-down": "hero/hero-walk-down",
      "walk-right": "hero/hero-walk-right",
      "walk-up": "hero/hero-walk-up",
      "walk-left": "hero/hero-walk-left",
      ...config.animations,
    };

    this.loadedAnimations = Assets.cache.get(config.json)?.data.animations;

    this.currentAnimation = config.currentAnimation || "idle-down";
    this.animationFrameLimit =
      config.animationFrameLimit || CONFIG.animationFrameLimit;

    // Reference the game object
    this.gameObject = config.gameObject;
    // this.sprite = AnimatedSprite.fromFrames(
    //   this.loadedAnimations[this.animations[this.currentAnimation]]
    // );

    this.isMounted = false;
    this.gameContainer = config.container;
    this.sprite = null;
    this.animationPlaying = false;
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame];
  }

  setAnimation(key) {
    if (this.currentAnimation !== key) {
      this.currentAnimation = key;

      this.animationFrameProgress = this.animationFrameLimit;
    }
  }

  render(cameraPerson, index) {
    const x =
      this.gameObject.x + withGrid(CONFIG.OFFSET.x) - cameraPerson.x - 8;
    const y =
      this.gameObject.y + withGrid(CONFIG.OFFSET.y) - cameraPerson.y - 8;

    if (this.sprite === null && !this.animationPlaying)  {
      this.sprite = AnimatedSprite.fromFrames(
        this.loadedAnimations[this.animations[this.currentAnimation]]
      );
      this.sprite.anchor.set(0.5);
      this.sprite.zIndex = index;
      this.sprite.x = x;
      this.sprite.y = y;
      this.sprite.animationSpeed = 1 / 6;
      this.sprite.loop = false;
      this.sprite.play();
      this.animationPlaying = true;

      this.sprite.onComplete = () => {
        this.gameContainer.removeChild(this.sprite);
        this.sprite.destroy();
        this.sprite = null;
      };
      this.sprite.eventMode = "static";
      this.gameContainer.addChild(this.sprite);
      this.animationPlaying = false;
    }

    this.sprite.position.set(x, y);

    if (!this.isMounted) {
      this.makeInteractable();

      this.isMounted = true;
    }
  }

  makeInteractable() {
    // Shows hand cursor
    this.sprite.buttonMode = true;

    this.sprite.on("pointerenter", (e) => {
      this.sprite.alpha = 0.5;
      console.log(e);
    });

    this.sprite.on("pointerleave", (e) => {
      this.sprite.alpha = 1;
      console.log(e);
    });
  }
}
