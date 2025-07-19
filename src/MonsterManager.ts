import { Application, Sprite, Assets } from "pixi.js";
import { Player } from "./Player";

export type Monster = {
  /** The visual representation of the monster */
  sprite: Sprite;
  /** Movement speed of the monster in pixels per frame */
  speed: number;
  /** Collision radius used for hit detection and movement logic */
  radius: number;
};

export class MonsterManager {
  private app: Application;
  private player: Player;
  private monsters: Monster[] = [];
  private monsterTexture: Sprite["texture"] | null = null;
  private monsterSpeed: number = 2;
  private _spawnInterval: number = 1000; // ms
  private spawnTimer: number | undefined;

  get spawnInterval(): number {
    return this._spawnInterval;
  }

  set spawnInterval(value: number) {
    if (typeof value === "number" && value > 0) {
      this._spawnInterval = value;
      this.restartSpawning();
    }
  }

  private restartSpawning() {
    this.stopSpawning();
    this.startSpawning();
  }

  constructor(app: Application, player: Player) {
    this.app = app;
    this.player = player;
  }

  async init() {
    // Load monster texture (reuse bunny for now)
    const texture = await Assets.load("/assets/bunny.png");
    this.monsterTexture = texture;
    this.startSpawning();
  }

  private startSpawning() {
    this.spawnTimer = window.setInterval(
      () => this.spawnMonster(),
      this._spawnInterval,
    );
  }

  private stopSpawning() {
    if (this.spawnTimer !== undefined) {
      clearInterval(this.spawnTimer);
      this.spawnTimer = undefined;
    }
  }

  private spawnMonster() {
    if (!this.monsterTexture) return;

    // Spawn at random edge
    const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let x = 0,
      y = 0;
    switch (edge) {
      case 0: // top
        x = Math.random() * this.app.screen.width;
        y = 0;
        break;
      case 1: // right
        x = this.app.screen.width;
        y = Math.random() * this.app.screen.height;
        break;
      case 2: // bottom
        x = Math.random() * this.app.screen.width;
        y = this.app.screen.height;
        break;
      case 3: // left
        x = 0;
        y = Math.random() * this.app.screen.height;
        break;
    }
    const monsterSprite = new Sprite(this.monsterTexture);
    monsterSprite.anchor.set(0.5);
    monsterSprite.position.set(x, y);
    // Randomly tint the monster to a different color
    monsterSprite.tint = Math.random() * 0xffffff;
    // Use half the width as radius for circle collision
    const radius = monsterSprite.width / 2;
    this.app.stage.addChild(monsterSprite);
    this.monsters.push({
      sprite: monsterSprite,
      speed: this.monsterSpeed,
      radius,
    });
  }

  update() {
    // Move monsters toward player, but avoid overlapping player and other monsters
    const playerPos = this.player.getPosition();
    const playerRadius = this.player.sprite.width / 2;

    this.monsters.forEach((monster, i) => {
      const dx = playerPos.x - monster.sprite.x;
      const dy = playerPos.y - monster.sprite.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Avoid overlapping player
      if (dist < monster.radius + playerRadius) {
        // Too close to player, don't move closer
        return;
      }

      // Avoid overlapping other monsters
      let moveAllowed = true;
      const nextX = monster.sprite.x + (dx / (dist || 1)) * monster.speed;
      const nextY = monster.sprite.y + (dy / (dist || 1)) * monster.speed;

      for (let j = 0; j < this.monsters.length; j++) {
        if (i === j) continue;
        const other = this.monsters[j];
        const odx = nextX - other.sprite.x;
        const ody = nextY - other.sprite.y;
        const odist = Math.sqrt(odx * odx + ody * ody);
        if (odist < monster.radius + other.radius) {
          moveAllowed = false;
          break;
        }
      }

      if (moveAllowed && dist > 0) {
        monster.sprite.x = nextX;
        monster.sprite.y = nextY;
      }
    });
  }

  getMonsters(): Monster[] {
    return this.monsters;
  }

  destroy() {
    this.stopSpawning();
    this.monsters.forEach((monster) => {
      monster.sprite.destroy();
    });
    this.monsters = [];
  }
}
