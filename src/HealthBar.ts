import { Container, Text, TextStyle } from "pixi.js";

export class HealthBar extends Container {
  private healthText: Text;
  private _health: number;
  private _maxHealth: number;

  constructor(initialHealth: number, maxHealth: number) {
    super();

    this._health = initialHealth;
    this._maxHealth = maxHealth;

    const style = new TextStyle({
      fontFamily: "Arial",
      fontSize: 28,
      fill: "#ffffff",
      stroke: "#000000",
    });

    this.healthText = new Text({ text: this.getHealthString(), style });
    this.healthText.anchor.set(0, 0);
    this.healthText.position.set(16, 16);

    this.addChild(this.healthText);
  }

  set health(value: number) {
    this._health = Math.max(0, Math.min(this._maxHealth, value));
    this.updateText();
  }

  get health() {
    return this._health;
  }

  set maxHealth(value: number) {
    this._maxHealth = value;
    this._health = Math.min(this._health, this._maxHealth);
    this.updateText();
  }

  get maxHealth() {
    return this._maxHealth;
  }

  private getHealthString() {
    return `Health: ${this._health}`;
  }

  private updateText() {
    this.healthText.text = this.getHealthString();
  }

  // Call this every frame to sync with player health
  update(currentHealth?: number, maxHealth?: number) {
    if (typeof currentHealth === "number") {
      this.health = currentHealth;
    }
    if (typeof maxHealth === "number") {
      this.maxHealth = maxHealth;
    }
  }
}
