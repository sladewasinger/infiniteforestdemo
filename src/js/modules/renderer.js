import { Camera } from "./camera.js";
import { Constants } from "./constants.js";
import { Mouse } from "./mouse.js";

export class Renderer {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      antialias: false,
      transparent: false,
      resolution: 1,
      view: this.canvas,
    });
    this.grid = [];
    this.camera = new Camera(this.app.screen.width, this.app.screen.height);
    this.app.stage.addChild(this.camera.container);
    this.mouse = new Mouse();
    this.canvas.addEventListener("wheel", this.onMouseWheel.bind(this));
    // this.camera.zoom = window.innerWidth / Constants.CELL_WIDTH / 11;
  }

  onMouseWheel(e) {
    if (e.deltaY < 0) {
      this.camera.zoom += 0.1;
    } else {
      this.camera.zoom -= 0.1;
    }
  }

  init(grid) {
    for (let x = 0; x < grid.length; x++) {
      this.grid[x] = [];
      for (let y = 0; y < grid[x].length; y++) {
        const cell = grid[x][y];
        const cellGraphics = new PIXI.Graphics();
        this.camera.container.addChild(cellGraphics);
        this.grid[x][y] = cellGraphics;
      }
    }
  }

  update(grid) {
    const colorMap = [0x000044, 0x0000ff, 0xffaa00, 0x00ff00, 0xffffff];
    for (let x = 0; x < this.grid.length; x++) {
      for (let y = 0; y < this.grid[x].length; y++) {
        const cellGraphics = this.grid[x][y];
        cellGraphics.clear();
        let color;
        if (grid[x][y].height > 0.7) {
          color = colorMap[3];
        } else if (grid[x][y].height > 0.4) {
          color = colorMap[2];
        } else if (grid[x][y].height > 0.3) {
          color = colorMap[1];
        } else {
          color = colorMap[0];
        }
        cellGraphics.beginFill(color);
        cellGraphics.drawRect(
          grid[x][y].x * (Constants.CELL_WIDTH + Constants.CELL_PADDING),
          grid[x][y].y * (Constants.CELL_HEIGHT + Constants.CELL_PADDING),
          Constants.CELL_WIDTH,
          Constants.CELL_HEIGHT
        );
        cellGraphics.endFill();
      }
    }

    this.camera.container.scale = new PIXI.Point(
      this.camera.zoom,
      this.camera.zoom
    );
    this.mouse.setPosition(
      this.app.renderer.plugins.interaction.mouse.global.x,
      this.app.renderer.plugins.interaction.mouse.global.y
    );
  }
}
