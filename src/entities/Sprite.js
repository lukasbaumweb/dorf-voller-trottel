import { CONFIG } from "../config";
import { withGrid } from "../utils";
import { AnimatedSprite, Assets, Sprite as PIXISprite } from "pixi.js";
export class Sprite {
  constructor(config) {
    this.image = PIXISprite.from(config.src);

    this.useShadow = config.useShadow || false;
    if (this.useShadow) {
      this.shadow = PIXISprite.from("/assets/shadow.png");
    }

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

    this.loadedAnimations = Assets.cache.get(
      "assets/spritesheets/characters.json"
    )?.data.animations;

    this.currentAnimation = config.currentAnimation || "idle-down";
    this.animationFrameLimit = config.animationFrameLimit || 1 / 6;

    //Reference the game object
    this.gameObject = config.gameObject;
    this.isAnimating = false;
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame];
  }

  setAnimation(key) {
    // console.log(key);

    if (this.currentAnimation !== key) {
      this.currentAnimation = key;
      this.currentAnimationFrame = 0;
      this.animationFrameProgress = this.animationFrameLimit;
    }
  }

  draw(app, delta, cameraPerson) {
    const x =
      this.gameObject.x + withGrid(CONFIG.OFFSET.x) - cameraPerson.x - 8;
    const y =
      this.gameObject.y + withGrid(CONFIG.OFFSET.y) - cameraPerson.y - 8;

    if (this.useShadow && this.shadow && !this.isMounted) {
      this.shadow.x = x;
      this.shadow.y = y;
      app.stage.addChild(this.shadow);
      this.isMounted = true;
    }

    const character = AnimatedSprite.fromFrames(
      this.loadedAnimations[this.animations[this.currentAnimation]]
    );

    if (!this.isAnimating) {
      character.animationSpeed = 1 / 6; // 6 fps
      this.isAnimating = false;
      character.anchor.set(0.5);

      character.onComplete = () => {
        this.isAnimating = false;
        character.destroy();
      };
      character.play();
    }
    character.position.set(x, y);

    app.stage.addChild(character);
  }
}
