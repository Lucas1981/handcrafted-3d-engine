import { WIDTH, HEIGHT } from "../constants";
// import { drawTriangleFlatShade } from "./shaders/flat-shader";
import { drawTriangleGouraudShaded } from "./shaders/gouraud-shader";

export class Graphics {
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.imageData = this.ctx.getImageData(0, 0, WIDTH, HEIGHT);
    this.zBuffer = new Array(WIDTH * HEIGHT).fill(0);
  }

  putImageData() {
    this.ctx.putImageData(this.imageData, 0, 0);
  }

  resetZBuffer() {
    this.zBuffer.fill(0);
  }

  clearScreenWithImageData() {
    for (let i = 0; i < WIDTH * HEIGHT * 4; i += 4) {
      this.imageData.data[i] = 0;
      this.imageData.data[i + 1] = 0;
      this.imageData.data[i + 2] = 0;
      this.imageData.data[i + 3] = 255;
    }
  }

  clearScreenWithContextCommands() {
    this.ctx.beginPath();
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
    this.ctx.fill();
  }

  drawLightSource(light) {
    this.ctx.beginPath();
    this.ctx.arc(
      Math.ceil(light.x),
      Math.ceil(light.y),
      Math.min(30, 30 * light.depth),
      0,
      2 * Math.PI,
    );
    this.ctx.fillStyle = "#ffff00";
    this.ctx.strokeStyle = "#ff8800";
    this.ctx.lineWidth = 2;
    this.ctx.fill();
    this.ctx.stroke();
  }

  // With the current solid modeling setup, this method wouldn't work anymore.
  // you'd have to remove the this.ctx.putImageData(this.imageData, 0, 0) statement
  // in the render method. You'd also have to switch to #clearScreenWithContextCommands
  // in the #clearScreen method.
  drawWireframe(screen, polygons) {
    for (const polygon of polygons) {
      this.ctx.beginPath();
      const p1 = screen[polygon.vertexIndices[0]];
      const p2 = screen[polygon.vertexIndices[1]];
      const p3 = screen[polygon.vertexIndices[2]];
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.lineTo(p2.x, p2.y);
      this.ctx.lineTo(p3.x, p3.y);
      this.ctx.lineTo(p1.x, p1.y);
      this.ctx.strokeStyle = polygon.color;
      this.ctx.stroke();
    }
  }

  drawGouraudShaded(screen, polygons, lighting, z) {
    for (const polygon of polygons) {
      const colors = lighting[polygon.id];
      drawTriangleGouraudShaded(
        polygon,
        colors,
        screen,
        this.imageData,
        this.zBuffer,
      );
    }
  }
}
