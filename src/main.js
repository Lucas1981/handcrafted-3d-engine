import "./style.css";
import {
  WIDTH,
  HEIGHT,
  HALF_SCREEN_WIDTH,
  HALF_SCREEN_HEIGHT,
  ASPECT_RATIO,
  FOV,
  W_EPS,
} from "./constants.js";
import { Mat4 } from "./math/Mat4.js";
import { degToRad } from "./math/trig.js";
import cubeJson from "./assets/cube.json";
import { Mesh3D } from "./geometry/Mesh3D.js";
import { Camera } from "./geometry/Camera.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const halfFOVAngleInRadians = degToRad * (FOV / 2);
const projectionMatrix = Mat4.perspective(
  Math.tan(halfFOVAngleInRadians),
  ASPECT_RATIO,
);
const camera = new Camera();
camera.setPos({ x: 0, y: 0, z: 0 });
const cube = new Mesh3D(cubeJson);
cube.setPosition({ x: 0, y: 0, z: 6 });
const meshes = [cube];

canvas.width = WIDTH;
canvas.height = HEIGHT;

let lastTime = Date.now();

const clearScreen = () => {
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fill();
};

const drawPolygons = (screen, mesh) => {
  for (const polygon of mesh.plist) {
    ctx.beginPath();
    const p1 = screen[polygon.vertexIndices[0]];
    const p2 = screen[polygon.vertexIndices[1]];
    const p3 = screen[polygon.vertexIndices[2]];
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.strokeStyle = polygon.color;
    ctx.stroke();
  }
};

const getSafeW = (w) => {
  if (w === 0) {
    return W_EPS;
  }

  if (Math.abs(w) < W_EPS) {
    return w < 0 ? -W_EPS : W_EPS;
  }

  return w;
};

const main = () => {
  const currentTime = Date.now();
  const elapsedTime = currentTime - lastTime;
  lastTime = currentTime;

  const rot = cube.getRotation();
  cube.setRotation({
    x: (rot.x + (1 / (360 / 0.2)) * elapsedTime) % 360,
    y: (rot.y + (1 / (360 / 0.2)) * elapsedTime) % 360,
    z: (rot.z + (1 / (360 / 0.2)) * elapsedTime) % 360,
  });

  clearScreen();

  const view = camera.getCameraTransformMatrix();

  for (const mesh of meshes) {
    const model = mesh.getModelMatrix();
    const mv = Mat4.multiply(model, view);
    const mvp = Mat4.multiply(mv, projectionMatrix);

    const tvlist = [];
    for (const vertex of mesh.vlist) {
      const vec = [...vertex, 1];
      tvlist.push(Mat4.transformVec4(vec, mvp));
    }

    const projected = tvlist.map((vertex) => {
      // Avoid division by zero or by extremely small number
      const safeW = getSafeW(vertex[3]);
      return {
        x: vertex[0] / safeW, // x / w
        y: vertex[1] / safeW, // y / w
      };
    });

    const screen = projected.map((p) => ({
      x: (p.x + 1) * HALF_SCREEN_WIDTH,
      y: (-p.y + 1) * HALF_SCREEN_HEIGHT,
    }));

    drawPolygons(screen, mesh);
  }

  requestAnimationFrame(main);
};

requestAnimationFrame(main);
