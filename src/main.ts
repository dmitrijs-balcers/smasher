import { Application, Assets } from "pixi.js";
import { Game } from "./Game";
import { initDevtools } from "@pixi/devtools";
import { Pane } from "tweakpane";

// Entry point for the game
(async () => {
  // Create a new PixiJS application
  const app = new Application();
  initDevtools({ app });

  // Initialize the application
  await app.init({ background: "#1099bb", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // Preload assets (player and monster sprites, currently using bunny.png for both)
  await Assets.load("/assets/bunny.png");

  // Initialize and start the game
  const game = new Game(app);

  // If any components require async initialization (e.g., MonsterManager), call their init here
  if (typeof game.monsterManager.init === "function") {
    await game.monsterManager.init();
  }

  const pane = new Pane();

  const params = {
    spawnInterval: game.monsterManager.spawnInterval,
  };

  pane
    .addBinding(params, "spawnInterval", {
      min: 5,
      max: 5000,
      step: 50,
      label: "Monster Spawn (ms)",
    })
    .on("change", (ev) => {
      game.monsterManager.spawnInterval = ev.value;
    });

  // The game loop is handled by the Game class via app.ticker
})();
