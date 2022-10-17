import { Renderer } from "./renderer.js";
import { Cell } from "./cell.js";
import { Constants } from "./constants.js";
import { PerlinNoise } from "./perlinNoise.js";

export class Engine {
  constructor() {
    this.grid = [];
    this.renderer = new Renderer();
    this.perlinNoise = new PerlinNoise(0.1);
  }

  init() {
    for (let x = 0; x < 10; x++) {
      this.grid[x] = [];
      for (let y = 0; y < 10; y++) {
        const cell = new Cell(
          x,
          y,
          Constants.CELL_WIDTH,
          Constants.CELL_HEIGHT
        );
        const noise = this.perlinNoise.noise2d((x + 1) / 100, (y + 1) / 100);
        console.log("Noise: ", noise);
        cell.color = 0xffffff * noise;
        this.grid[x][y] = cell;
      }
    }

    this.renderer.init(this.grid);

    this.lastUpdate = Date.now();
    window.requestAnimationFrame(this.update.bind(this));
  }

  update() {
    this.renderer.update(this.grid);

    const deltaTime = Date.now() - this.lastUpdate;
    this.lastUpdate = Date.now();
    window.requestAnimationFrame(this.update.bind(this));
  }
}
