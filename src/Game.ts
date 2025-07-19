import { Application } from "pixi.js";
import { Player } from "./Player";
import { MonsterManager } from "./MonsterManager";
import { HealthBar } from "./HealthBar";

/**
 * Main Game orchestrator.
 * Initializes PixiJS, creates and manages all game components, and runs the game loop.
 */
export class Game {
  public app: Application;
  public player: Player;
  public monsterManager: MonsterManager;
  public healthBar: HealthBar;

  constructor(app: Application) {
    this.app = app;

    // Initialize player
    this.player = new Player(this.app, "/assets/bunny.png", 100, 5);

    // Initialize health bar UI
    this.healthBar = new HealthBar(this.player.health, this.player.maxHealth);
    this.app.stage.addChild(this.healthBar);

    // Initialize monster manager
    this.monsterManager = new MonsterManager(this.app, this.player);

    // Add ticker for game loop
    this.app.ticker.add(this.update.bind(this));
  }

  /**
   * Main game loop.
   */
  update(): void {
    this.player.update();
    this.monsterManager.update();
    this.healthBar.update(this.player.health, this.player.maxHealth);
  }
}
