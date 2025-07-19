import { Sprite, Texture, Container } from "pixi.js";

/**
 * Represents a single monster in the game.
 * Handles its own sprite, movement, and basic logic.
 */
export class Monster {
  public sprite: Sprite;
  public speed: number;

  constructor(texture: Texture, x: number, y: number, speed: number = 2) {
    this.sprite = new Sprite(texture);
    this.sprite.anchor.set(0.5);
    this.sprite.position.set(x, y);
    this.speed = speed;
  }

  /**
   * Move the monster toward a target position (e.g., the player).
   * @param targetX Target X coordinate
   * @param targetY Target Y coordinate
   */
  moveToward(targetX: number, targetY: number) {
    const dx = targetX - this.sprite.x;
    const dy = targetY - this.sprite.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 0) {
      this.sprite.x += (dx / dist) * this.speed;
      this.sprite.y += (dy / dist) * this.speed;
    }
  }

  /**
   * Add this monster's sprite to a PIXI.Container (e.g., the stage).
   */
  addTo(container: Container) {
    container.addChild(this.sprite);
  }

  /**
   * Remove this monster's sprite from a PIXI.Container.
   */
  removeFrom(container: Container) {
    container.removeChild(this.sprite);
  }
}
