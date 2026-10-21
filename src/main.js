import "./style.css";
import {
  WIDTH,
  HEIGHT,
  ASPECT_RATIO,
  FOV,
  NEAR,
  SHOW_FPS,
} from "./constants.js";
import { Mat4 } from "./math/Mat4.js";
import { degToRad } from "./math/trig.js";
// import cubeJson from "./assets/cube.json";
// import torusJson from "./assets/torus.json";
// import texturedCubeJson from "./assets/textured-cube.json";
import room from "./assets/room.json";
import { Mesh3D } from "./geometry/Mesh3D.js";
import { Camera } from "./geometry/Camera.js";
import { Renderer } from "./render/Renderer.js";
import { DirectionalLight } from "./light/DirectionalLight.js";
import { PointLight } from "./light/PointLight.js";
import { SpotLight } from "./light/SpotLight.js";
import { Vec3 } from "./math/Vec3.js";
import { TextureMap } from "./texture/TextureMap.js";
import { Inputs } from "./inputs";

const degreesPerSecond = 15;
const canvas = document.getElementById("canvas");
const textureMap = new TextureMap();
const halfFOVAngleInRadians = degToRad * (FOV / 2);
const projectionMatrix = Mat4.perspective(
  Math.tan(halfFOVAngleInRadians),
  ASPECT_RATIO,
  NEAR,
);
const renderer = new Renderer(canvas, projectionMatrix);
const camera = new Camera();
camera.setPos({ x: 0, y: -0.2, z: 5 });
const mesh = new Mesh3D(room, textureMap);
mesh.setPosition({ x: 0, y: 0, z: 5 });
const meshes = [mesh];
const AMBIENT_LIGHT = 0.5;
const lights = [
  // new DirectionalLight(1, [255, 255, 255], { x: 0, y: 0, z: 1 }),
  new PointLight(1, { x: 0, y: 1, z: 3 }),
  // new SpotLight(10, { x: 5, y: 0, z: 5 }, { x: 0, y: 0, z: 1 }),
];

canvas.width = WIDTH;
canvas.height = HEIGHT;

let lastTime = Date.now();

const inputs = new Inputs();

const handleInputs = (elapsedTime) => {
  const keymap = inputs.getKeymap();
  if (keymap.ArrowUp) {
    camera.moveForward(0.001 * elapsedTime);
  }

  if (keymap.ArrowDown) {
    camera.moveForward(-0.001 * elapsedTime);
  }

  if (keymap.ArrowRight) {
    camera.increaseElevation(0.05 * elapsedTime);
  }

  if (keymap.ArrowLeft) {
    camera.increaseElevation(-0.05 * elapsedTime);
  }

  if (keymap.w) {
    camera.increaseHeading(0.05 * elapsedTime);
  }

  if (keymap.s) {
    camera.increaseHeading(-0.05 * elapsedTime);
  }
};

const showFPS = (elapsedTime) => {
  renderer.write(10, 10, parseInt(1000 / elapsedTime));
};

const main = () => {
  const currentTime = Date.now();
  const elapsedTime = currentTime - lastTime;
  lastTime = currentTime;
  handleInputs(elapsedTime);
  const p = performance.now();
  renderer.render(meshes, camera, lights, AMBIENT_LIGHT);
  if (SHOW_FPS) {
    showFPS(performance.now() - p);
  }
  requestAnimationFrame(main);
};

(async () => {
  await Promise.all(textureMap.getPromises());
  requestAnimationFrame(main);
})();
