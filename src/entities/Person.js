import { CONFIG } from "../config";
import { emitEvent, nextPosition } from "../utils";
import { GameObject } from "./GameObject";

export class Person extends GameObject {
  constructor(config) {
    super({ ...config, interactable: true });
    this.movingProgressRemaining = 0;
    this.isStanding = false;
    this.intentPosition = null; // [x,y]

    this.isPlayerControlled = config.isPlayerControlled || false;

    const movementSpeed = 1;

    this.directionUpdate = {
      up: ["y", -movementSpeed],
      down: ["y", movementSpeed],
      left: ["x", -movementSpeed],
      right: ["x", movementSpeed],
    };
    this.standBehaviorTimeout = 1;
    this.index = config.index || 0;
  }

  update(state) {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
    } else {
      //We're keyboard ready and have an arrow pressed
      if (!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow) {
        this.startBehavior(state, {
          type: "walk",
          direction: state.arrow,
        });
      }
      this.updateSprite(state);
    }
  }

  startBehavior(state, behavior) {
    if (!this.isMounted) {
      return;
    }

    //Set character direction to whatever behavior has
    this.direction = behavior.direction;
    if (behavior.type === "walk") {
      //Stop here if space is not free
      // console.log(behavior.type);

      const isOutside = state.map.isOutofBounds(this.x, this.y, this.direction);
      const isSpaceTaken = state.map.isSpaceTaken(this.x, this.y, this.direction);
      if (isSpaceTaken || isOutside) {
        behavior.retry &&
          setTimeout(() => {
            this.startBehavior(state, behavior);
          }, 100);
        return;
      }

      //Ready to walk!
      this.movingProgressRemaining = CONFIG.PIXEL_SIZE;

      //Add next position intent
      const intentPosition = nextPosition(this.x, this.y, this.direction);
      this.intentPosition = [intentPosition.x, intentPosition.y];

      this.updateSprite(state);
    }

    if (behavior.type === "stand") {
      this.isStanding = true;

      if (this.standBehaviorTimeout) {
        clearTimeout(this.standBehaviorTimeout);
        console.log("xlear");
      }
      this.standBehaviorTimeout = setTimeout(() => {
        emitEvent("PersonStandComplete", {
          whoId: this.id,
        });
        this.isStanding = false;
      }, behavior.time);
    }
  }

  updatePosition() {
    const [property, change] = this.directionUpdate[this.direction];
    this[property] += change;
    this.movingProgressRemaining -= 1;

    // console.log(this.movingProgressRemaining)
    if (this.movingProgressRemaining <= 0) {
      //We finished the walk!
      this.intentPosition = null;
      emitEvent("PersonWalkingComplete", {
        whoId: this.id,
      });
    }
  }

  updateSprite() {
    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation("walk-" + this.direction);
      return;
    }
    this.sprite.setAnimation("idle-" + this.direction);
  }
}
