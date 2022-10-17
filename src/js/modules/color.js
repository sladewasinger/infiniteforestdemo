export class Color {
  static rgbToHex(r, g, b) {
    return (r << 16) | (g << 8) | b;
  }
}
