import { Camera } from "./camera.js";
import { Constants } from "./constants.js";
import { Mouse } from "./mouse.js";

export class Renderer {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      antialias: true,
      transparent: false,
      resolution: 1,
      view: this.canvas,
    });
    this.camera = new Camera(this.app.screen.width, this.app.screen.height);
    this.app.stage.addChild(this.camera.container);
    this.mouse = new Mouse();
    window.addEventListener("scroll", this.onScroll.bind(this));
  }

  onScroll(e) {
    if (e.deltaY > 0) {
      this.camera.zoom += 0.01;
    } else {
      this.camera.zoom -= 0.01;
    }
  }

  init(grid) {
    for (let x = 0; x < grid.length; x++) {
      for (let y = 0; y < grid[x].length; y++) {
        const cell = grid[x][y];
        const cellGraphics = new PIXI.Graphics();
        cellGraphics.beginFill(cell.color);
        cellGraphics.drawRect(
          cell.x * (Constants.CELL_WIDTH + Constants.CELL_PADDING),
          cell.y * (Constants.CELL_HEIGHT + Constants.CELL_PADDING),
          cell.width,
          cell.height
        );
        cellGraphics.endFill();
        this.camera.container.addChild(cellGraphics);
      }
    }
  }

  update(grid) {
    this.mouse.setPosition(
      this.app.renderer.plugins.interaction.mouse.global.x,
      this.app.renderer.plugins.interaction.mouse.global.y
    );
  }
}
