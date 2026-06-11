import "./style.css";
import { WIDTH, HEIGHT, ASPECT_RATIO, FOV } from "./constants.js";
import { Mat4 } from "./math/Mat4.js";
import { degToRad } from "./math/trig.js";
import cubeJson from "./assets/cube.json";
import { Mesh3D } from "./geometry/Mesh3D.js";
import { Camera } from "./geometry/Camera.js";
import { Renderer } from "./render/Renderer.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const halfFOVAngleInRadians = degToRad * (FOV / 2);
const projectionMatrix = Mat4.perspective(
  Math.tan(halfFOVAngleInRadians),
  ASPECT_RATIO,
);
const renderer = new Renderer(ctx, projectionMatrix);
const camera = new Camera();
camera.setPos({ x: 0, y: 0, z: 0 });
const cube = new Mesh3D(cubeJson);
cube.setPosition({ x: 0, y: 0, z: 10 });
const meshes = [cube];

canvas.width = WIDTH;
canvas.height = HEIGHT;

let lastTime = Date.now();

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

  renderer.render(meshes, camera);
  // requestAnimationFrame(main);
};

requestAnimationFrame(main);
