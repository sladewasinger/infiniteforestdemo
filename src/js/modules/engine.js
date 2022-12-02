import { Renderer } from "./renderer.js";
import { Cell } from "./cell.js";
import { Constants } from "./constants.js";
import { PerlinNoise } from "./perlinNoise.js";
import { Color } from "./color.js";

export class Chunk {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.grid = [];
    this.generate();
  }

  generate() {
    this.grid = [];
    let perlinNoise = new PerlinNoise();
    for (let x = 0; x < Constants.CHUNK_SIZE; x++) {
      this.grid[x] = [];
      for (let y = 0; y < Constants.CHUNK_SIZE; y++) {
        const height = perlinNoise.noise2d(
          (this.x + x) * 0.1,
          (this.y + y) * 0.1,
        );
        this.grid[x][y] = new Cell(x, y, height);
      }
    }
  }
}

export class Engine {
  constructor() {
    this.grid = [];
    this.renderer = new Renderer();
    this.perlinNoise = new PerlinNoise(0.3);
    this.keys = {};
    this.inputDebounce = false;
    this.gridOffset = { x: 0, y: 0 };
    this.chunks = [];
    this.handleInputTimerId = null;
    window.addEventListener("keydown", this.keyDown.bind(this));
    window.addEventListener("keyup", this.keyUp.bind(this));
  }

  keyDown(e) {
    if (!this.keys[e.key]) {
      this.keys[e.key] = true;
      this.inputDebounce = false;
      this.handleInput();
    }
    this.keys[e.key] = true;
  }

  keyUp(e) {
    this.keys[e.key] = false;
  }

  init() {
    this.updateGrid2();

    //this.renderer.init(this.grid);

    this.lastUpdate = Date.now();
    window.setInterval(this.handleInput.bind(this), 100);
    window.requestAnimationFrame(this.update.bind(this));
  }

  updateGrid2() {
    const origin = this.gridOffset;
    const chunkDistance = 3;
    const chunkSize = Constants.CHUNK_SIZE;

    // snap origin to chunkSize 
    const gridPos = {
      x: Math.floor(origin.x / chunkSize) * chunkSize,
      y: Math.floor(origin.y / chunkSize) * chunkSize,
    };
    const gridX = gridPos.x;
    const gridY = gridPos.y;

    // Remove chunks outside of chunkDistance
    for (let i = 0; i < this.chunks.length; i++) {
      const chunk = this.chunks[i];
      const chunkX = chunk.x; // Math.floor(chunk.x / chunkSize);
      const chunkY = chunk.y; // Math.floor(chunk.y / chunkSize);
      if (
        Math.abs(chunkX - gridX) > chunkDistance ||
        Math.abs(chunkY - gridY) > chunkDistance
      ) {
        this.chunks.splice(i, 1);
        i--;
      }
    }

    // Add chunks that are now visible
    for (let x = gridX - chunkSize * chunkDistance; x <= gridX + chunkSize * chunkDistance; x += chunkSize) {
      for (let y = gridY - chunkSize * chunkDistance; y <= gridY + chunkSize * chunkDistance; y += chunkSize) {
        let chunk = this.chunks.find((c) => c.x == x && c.y == y);
        if (!chunk) {
          chunk = new Chunk(x, y);
          this.chunks.push(chunk);
        }
      }
    }
  }

  // const centerChunk = new Chunk(gridX, gridY);
  // const leftChunk = new Chunk(gridX - Constants.CHUNK_SIZE, gridY);
  // const rightChunk = new Chunk(gridX + Constants.CHUNK_SIZE, gridY);
  // this.chunks = [centerChunk, leftChunk, rightChunk];


  updateGrid() {
    const canvas = document.getElementById("canvas");
    const width = canvas.width;
    const height = canvas.height;
    for (let x = 0; x < width / Constants.CELL_WIDTH; x++) {
      this.grid[x] = [];
      for (let y = 0; y < height / Constants.CELL_HEIGHT * 2; y++) {
        const cell = new Cell(x, y);
        const noise = this.perlinNoise.noise2d(
          (this.gridOffset.x + x) * 0.1,
          (this.gridOffset.y + y) * 0.1
        );
        cell.height = noise;
        this.grid[x][y] = cell;
      }
    }
  }

  handleInput() {
    if (this.inputDebounce) {
      return;
    }

    this.inputDebounce = true;
    window.clearTimeout(this.debounceTimeout);
    this.debounceTimeout = window.setTimeout(() => {
      this.inputDebounce = false;
    }, 100);

    const dir = { x: 0, y: 0 };

    if (this.keys["w"]) {
      dir.y -= 1;
    }
    if (this.keys["s"]) {
      dir.y += 1;
    }
    if (this.keys["a"]) {
      dir.x -= 1;
    }
    if (this.keys["d"]) {
      dir.x += 1;
    }

    if (dir.x !== 0 || dir.y !== 0) {
      this.gridOffset.x += dir.x;
      this.gridOffset.y += dir.y;
      this.updateGrid2();
    }
  }

  update() {
    this.renderer.render(this.chunks, this.gridOffset);

    const deltaTime = Date.now() - this.lastUpdate;
    this.lastUpdate = Date.now();
    window.requestAnimationFrame(this.update.bind(this));
  }
}
