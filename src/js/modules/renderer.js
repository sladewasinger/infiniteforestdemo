import { Camera } from "./camera.js";
import { Constants } from "./constants.js";
import { Mouse } from "./mouse.js";
import { Vector2d } from "./vector2d.js";

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
    this.graphics = new PIXI.Graphics();
    this.camera.container.addChild(this.graphics);
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
    let gridContainer = new PIXI.Container();
    gridContainer.position = new PIXI.Point(
      this.app.screen.width / 2 - (grid.length * Constants.CELL_WIDTH) / 2,
      this.app.screen.height / 2 - (grid.length * Constants.CELL_HEIGHT) / 2
    );

    for (let x = 0; x < grid.length; x++) {
      this.grid[x] = [];
      for (let y = 0; y < grid[x].length; y++) {
        const cell = grid[x][y];
        const cellGraphics = new PIXI.Graphics();
        gridContainer.addChild(cellGraphics);
        this.grid[x][y] = cellGraphics;
      }
    }

    this.camera.container.addChild(gridContainer);
  }

  update(grid) {
    const colorMap = [0x000044, 0x0000ff, 0xffaa00, 0x00ff00, 0xaaaaaa];
    for (let x = 0; x < this.grid.length; x++) {
      for (let y = 0; y < this.grid[x].length; y++) {
        const cellGraphics = this.grid[x][y];
        cellGraphics.clear();
        let color;
        if (grid[x][y].height > 0.7) {
          color = colorMap[4];
        } else if (grid[x][y].height > 0.4) {
          color = colorMap[3];
        } else if (grid[x][y].height > 0.3) {
          color = colorMap[2];
        } else if (grid[x][y].height > 0.2) {
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

  render(chunks, origin) {
    this.graphics.clear();
    this.mouse.setPosition(
      this.app.renderer.plugins.interaction.mouse.global.x,
      this.app.renderer.plugins.interaction.mouse.global.y
    );


    this.camera.x = origin.x * (Constants.CELL_WIDTH + Constants.CELL_PADDING);
    this.camera.y = origin.y * (Constants.CELL_HEIGHT + Constants.CELL_PADDING);

    const offset = new Vector2d(
      this.canvas.width / 2 - this.camera.x,
      this.canvas.height / 2 - this.camera.y
    );

    const colorMap = [0x000044, 0x0000ff, 0xffaa00, 0x00ff00, 0xaaaaaa];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      for (let x = 0; x < chunk.grid.length; x++) {
        for (let y = 0; y < chunk.grid[x].length; y++) {
          const cell = chunk.grid[x][y];
          let color;
          if (cell.height > 0.7) {
            color = colorMap[4];
          } else if (cell.height > 0.4) {
            color = colorMap[3];
          } else if (cell.height > 0.3) {
            color = colorMap[2];
          } else if (cell.height > 0.2) {
            color = colorMap[1];
          } else {
            color = colorMap[0];
          }

          this.graphics.lineStyle(0);
          this.graphics.beginFill(color);
          this.graphics.drawRect(
            (cell.x + chunk.x) * (Constants.CELL_WIDTH + Constants.CELL_PADDING) + offset.x,
            (cell.y + chunk.y) * (Constants.CELL_HEIGHT + Constants.CELL_PADDING) + offset.y,
            Constants.CELL_WIDTH,
            Constants.CELL_HEIGHT
          );
          this.graphics.endFill();
        }
      }
    }

    if (Constants.DRAW_CHUNK_BOUNDARIES) {
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        this.graphics.lineStyle(2, 0xff0000, 1);
        this.graphics.drawRect(
          chunk.x * (Constants.CELL_WIDTH + Constants.CELL_PADDING) + offset.x,
          chunk.y * (Constants.CELL_HEIGHT + Constants.CELL_PADDING) + offset.y,
          chunk.grid.length * (Constants.CELL_WIDTH + Constants.CELL_PADDING),
          chunk.grid.length * (Constants.CELL_HEIGHT + Constants.CELL_PADDING)
        );
      }
    }

    this.graphics.beginFill(0xff0000);
    this.graphics.drawRect(
      origin.x * (Constants.CELL_WIDTH + Constants.CELL_PADDING) + offset.x,
      origin.y * (Constants.CELL_HEIGHT + Constants.CELL_PADDING) + offset.y,
      Constants.CELL_WIDTH,
      Constants.CELL_HEIGHT
    );
  }
}