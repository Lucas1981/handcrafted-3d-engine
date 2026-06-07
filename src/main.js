import "./style.css";
import { WIDTH, HEIGHT } from "./constants.js";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = WIDTH;
canvas.height = HEIGHT;

let lastTime = Date.now();

const main = () => {
  const currentTime = Date.now();
  const elapsedTime = currentTime - lastTime;
  lastTime = currentTime;

  ctx.beginPath();
  ctx.strokeStyle = "red";
  ctx.moveTo(0, 0);
  ctx.lineTo(100, 100);
  ctx.lineTo(0, 100);
  ctx.lineTo(0, 0);
  ctx.stroke();
  ctx.requestAnimationFrame(main);
};

ctx.beginPath();
ctx.fillStyle = "black";
ctx.fillRect(0, 0, WIDTH, HEIGHT);
ctx.fill();
requestAnimationFrame(main);
