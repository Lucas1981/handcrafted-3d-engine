import "./style.css";
import { WIDTH, HEIGHT, ASPECT_RATIO, FOV } from "./constants.js";
import { Mat4 } from "./math/Mat4.js";
import { degToRad } from "./math/trig.js";
import cubeJson from "./assets/cube.json";
import { Mesh3D } from "./geometry/Mesh3D.js";
import { Camera } from "./geometry/Camera.js";
import { Renderer } from "./render/Renderer.js";
import { DirectionalLight } from "./light/DirectionalLight.js";
import { PointLight } from "./light/PointLight.js";
import { Vec3 } from "./math/Vec3.js";

const degreesPerSecond = 15;
const canvas = document.getElementById("canvas");
const halfFOVAngleInRadians = degToRad * (FOV / 2);
const projectionMatrix = Mat4.perspective(
  Math.tan(halfFOVAngleInRadians),
  ASPECT_RATIO,
);
const renderer = new Renderer(canvas, projectionMatrix);
const camera = new Camera();
camera.setPos({ x: 0, y: 0, z: 0 });
const topMesh = new Mesh3D(cubeJson);
topMesh.setPosition({ x: 0, y: 0, z: 5 });
const mesh = new Mesh3D(cubeJson);
mesh.setPosition({ x: 0, y: 0, z: 5 });
const meshes = [
  mesh,
  // topMesh,
];
const lights = [
  // new DirectionalLight(1, [255, 255, 255], { x: 0, y: 0, z: 1 }),
  new PointLight(3, { x: 0, y: 1, z: 3 }),
];

canvas.width = WIDTH;
canvas.height = HEIGHT;

let lastTime = Date.now();

const main = () => {
  const currentTime = Date.now();
  const elapsedTime = currentTime - lastTime;
  lastTime = currentTime;

  const rot = mesh.getRotation();
  mesh.setRotation({
    x: 0, // (rot.x + (1 / 360) * elapsedTime * degreesPerSecond) % 360,
    y: (rot.y + (1 / 360) * elapsedTime * degreesPerSecond) % 360,
    z: 0, // (rot.z + (1 / 360) * elapsedTime * degreesPerSecond) % 360,
  });

  renderer.render(meshes, camera, lights);
  requestAnimationFrame(main);
};

requestAnimationFrame(main);
