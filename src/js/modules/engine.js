import { Renderer } from "./renderer.js";
import { Cell } from "./cell.js";
import { Constants } from "./constants.js";
import { PerlinNoise } from "./perlinNoise.js";
import { Color } from "./color.js";

export class Engine {
  constructor() {
    this.grid = [];
    this.renderer = new Renderer();
    this.perlinNoise = new PerlinNoise(0.7);
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
        const noise = this.perlinNoise.noise2d((x + 1) / 10, (y + 1) / 10);
        cell.color = Color.rgbToHex(noise * 255, noise * 255, noise * 255);
        //0xff * noise + ((0xff * noise) << 8) + ((0xff * noise) << 16);
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
