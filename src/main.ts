import { Application, Assets, Sprite, Text, TextStyle } from "pixi.js";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#1099bb", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // Load the bunny texture
  const texture = await Assets.load("/assets/bunny.png");

  // --- Player Health ---
  let playerHealth = 100;
  const maxHealth = 100;

  // Health regeneration: increase by 1 every second, up to maxHealth
  setInterval(() => {
    if (playerHealth < maxHealth) {
      playerHealth = Math.min(maxHealth, playerHealth + 1);
    }
  }, 1000);

  // Health UI
  const healthStyle = new TextStyle({
    fontFamily: "Arial",
    fontSize: 28,
    fill: "#ffffff",
    stroke: "#000000",
  });
  const healthText = new Text({
    style: healthStyle,
    text: `Health: ${playerHealth}`,
  });
  healthText.anchor.set(0, 0);
  healthText.position.set(16, 16);
  app.stage.addChild(healthText);

  // Simulate health loss for demo: press 'H' to lose 10 health
  window.addEventListener("keydown", (e) => {
    if (e.key === "h" || e.key === "H") {
      playerHealth = Math.max(0, playerHealth - 10);
      healthText.text = `Health: ${playerHealth}`;
    }
  });

  // Create a bunny Sprite
  const bunny = new Sprite(texture);

  // Center the sprite's anchor point
  bunny.anchor.set(0.5);

  // Move the sprite to the center of the screen
  bunny.position.set(app.screen.width / 2, app.screen.height / 2);

  // Add the bunny to the stage
  app.stage.addChild(bunny);

  // --- Player Movement State ---
  const speed = 5;
  const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    a: false,
    s: false,
    d: false,
  };

  window.addEventListener("keydown", (e) => {
    const key = e.key;
    if (key in keys) keys[key as keyof typeof keys] = true;
  });

  window.addEventListener("keyup", (e) => {
    const key = e.key;
    if (key in keys) keys[key as keyof typeof keys] = false;
  });

  // Listen for animate update
  app.ticker.add(() => {
    let dx = 0,
      dy = 0;
    if (keys.ArrowUp || keys.w) dy -= 1;
    if (keys.ArrowDown || keys.s) dy += 1;
    if (keys.ArrowLeft || keys.a) dx -= 1;
    if (keys.ArrowRight || keys.d) dx += 1;

    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
      dx *= Math.SQRT1_2;
      dy *= Math.SQRT1_2;
    }

    bunny.x += dx * speed;
    bunny.y += dy * speed;

    // Keep player within screen bounds
    bunny.x = Math.max(
      bunny.width / 2,
      Math.min(app.screen.width - bunny.width / 2, bunny.x),
    );
    bunny.y = Math.max(
      bunny.height / 2,
      Math.min(app.screen.height - bunny.height / 2, bunny.y),
    );

    // Update health UI in case health changes elsewhere
    healthText.text = `Health: ${playerHealth}`;
  });
})();
