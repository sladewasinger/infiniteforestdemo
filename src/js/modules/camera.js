export class Camera {
  constructor(width, height) {
    this.x = 0;
    this.y = 0;
    this.zoom = 1;

    this.container = new PIXI.Container();
    this.container.width = width;
    this.container.height = height;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    this.container.position = new PIXI.Point(x, y);
  }
}
