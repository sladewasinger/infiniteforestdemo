import { Renderer } from "./renderer.js";
import { Cell } from "./cell.js";
import { Constants } from "./constants.js";
import { PerlinNoise } from "./perlinNoise.js";
import { Color } from "./color.js";

export class Engine {
  constructor() {
    this.grid = [];
    this.renderer = new Renderer();
    this.perlinNoise = new PerlinNoise(0.3);
    this.keys = {};
    this.debounce = false;
    this.gridOffset = { x: 0, y: 0 };
    window.addEventListener("keydown", this.keyDown.bind(this));
    window.addEventListener("keyup", this.keyUp.bind(this));
  }

  keyDown(e) {
    this.keys[e.key] = true;
  }

  keyUp(e) {
    this.keys[e.key] = false;
  }

  init() {
    this.updateGrid();

    this.renderer.init(this.grid);

    this.lastUpdate = Date.now();
    window.requestAnimationFrame(this.update.bind(this));
  }

  updateGrid() {
    for (let x = 0; x < 25; x++) {
      this.grid[x] = [];
      for (let y = 0; y < 25; y++) {
        const cell = new Cell(x, y);
        const noise = this.perlinNoise.noise2d(
          (this.gridOffset.x + x) * 0.1,
          (this.gridOffset.y + y) * 0.1
        );
        cell.height = noise;
        console.log(noise);
        cell.color = Color.rgbToHex(noise * 255, noise * 255, noise * 255);
        this.grid[x][y] = cell;
      }
    }
  }

  update() {
    if (!this.debounce) {
      this.debounce = true;
      setTimeout(() => (this.debounce = false), 50);

      const dir = { x: 0, y: 0 };

      if (this.keys["w"]) {
        dir.y -= 1;
        this.updateGrid();
      }
      if (this.keys["s"]) {
        dir.y += 1;
        this.updateGrid();
      }
      if (this.keys["a"]) {
        dir.x -= 1;
        this.updateGrid();
      }
      if (this.keys["d"]) {
        dir.x += 1;
        this.updateGrid();
      }

      this.gridOffset.x += dir.x;
      this.gridOffset.y += dir.y;
    }

    this.renderer.update(this.grid);

    const deltaTime = Date.now() - this.lastUpdate;
    this.lastUpdate = Date.now();
    window.requestAnimationFrame(this.update.bind(this));
  }
}
