import { Sprite, Application, Assets, Texture } from "pixi.js";

export class Player {
  public sprite: Sprite;
  public health: number;
  public maxHealth: number;
  private speed: number;
  private keys: Record<string, boolean>;

  constructor(
    private app: Application,
    texture: string | Texture,
    startHealth = 100,
    speed = 5,
  ) {
    this.health = startHealth;
    this.maxHealth = startHealth;
    this.speed = speed;
    this.keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      w: false,
      a: false,
      s: false,
      d: false,
    };

    // Create sprite
    this.sprite = new Sprite(
      typeof texture === "string" ? Assets.get(texture) : texture,
    );
    this.sprite.anchor.set(0.5);
    this.sprite.position.set(app.screen.width / 2, app.screen.height / 2);
    app.stage.addChild(this.sprite);

    // Keyboard listeners
    window.addEventListener("keydown", (e) => {
      if (e.key in this.keys) this.keys[e.key] = true;
    });
    window.addEventListener("keyup", (e) => {
      if (e.key in this.keys) this.keys[e.key] = false;
    });
  }

  update() {
    let dx = 0,
      dy = 0;
    if (this.keys.ArrowUp || this.keys.w) dy -= 1;
    if (this.keys.ArrowDown || this.keys.s) dy += 1;
    if (this.keys.ArrowLeft || this.keys.a) dx -= 1;
    if (this.keys.ArrowRight || this.keys.d) dx += 1;

    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
      dx *= Math.SQRT1_2;
      dy *= Math.SQRT1_2;
    }

    this.sprite.x += dx * this.speed;
    this.sprite.y += dy * this.speed;

    // Keep player within screen bounds
    this.sprite.x = Math.max(
      this.sprite.width / 2,
      Math.min(this.app.screen.width - this.sprite.width / 2, this.sprite.x),
    );
    this.sprite.y = Math.max(
      this.sprite.height / 2,
      Math.min(this.app.screen.height - this.sprite.height / 2, this.sprite.y),
    );
  }

  getPosition(): { x: number; y: number } {
    return {
      x: this.sprite.x,
      y: this.sprite.y,
    };
  }

  takeDamage(amount: number) {
    this.health = Math.max(0, this.health - amount);
  }

  heal(amount: number) {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }
}
