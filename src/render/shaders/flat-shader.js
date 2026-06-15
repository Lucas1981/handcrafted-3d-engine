import { plotPixel } from "./utils";
import { WIDTH, HEIGHT } from "../../constants";

const fillTriangleFlatBottom = (triangle, color, imageData) => {
  const dxl =
    (triangle[0][0] - triangle[2][0]) / (triangle[0][1] - triangle[2][1]);
  const dxr =
    (triangle[0][0] - triangle[1][0]) / (triangle[0][1] - triangle[1][1]);

  let clx = triangle[0][0];
  let crx = triangle[0][0];
  let startY = triangle[0][1];
  let endY = triangle[2][1];

  // Clamp y to screen size
  endY = endY < HEIGHT ? endY : HEIGHT - 1;
  if (startY < 0) {
    crx += dxr * startY * -1;
    clx += dxl * startY * -1;
    startY = 0;
  }

  for (let cy = startY; cy <= endY; cy++) {
    let base = (cy * imageData.width + Math.ceil(crx > clx ? clx : crx)) * 4;
    let startX = Math.ceil(crx > clx ? clx : crx);
    let endX = Math.ceil(crx > clx ? crx : clx);
    // Clamp x to screen size
    base += startX < 0 ? startX * -1 * 4 : 0;
    startX = startX > 0 ? startX : 0;
    endX = endX < WIDTH ? endX : WIDTH - 1;
    for (let i = startX; i <= endX; i++) {
      plotPixel(imageData, base, color);
      base += 4;
    }

    crx += dxr;
    clx += dxl;
  }
};

const fillTriangleFlatTop = (triangle, color, imageData) => {
  const dxl =
    (triangle[2][0] - triangle[0][0]) / (triangle[2][1] - triangle[0][1]);
  const dxr =
    (triangle[2][0] - triangle[1][0]) / (triangle[2][1] - triangle[1][1]);

  let clx = triangle[2][0];
  let crx = triangle[2][0];

  let startY = triangle[2][1];
  let endY = triangle[0][1];

  // Clamp y to screen size
  endY = endY < 0 ? 0 : endY;
  if (startY > HEIGHT) {
    const diff = startY - HEIGHT;
    crx -= dxr * diff;
    clx -= dxl * diff;
    startY = HEIGHT - 1;
  }

  for (let cy = startY; cy >= endY; cy--) {
    let base = (cy * imageData.width + Math.ceil(crx > clx ? clx : crx)) * 4;
    let startX = Math.ceil(crx > clx ? clx : crx);
    let endX = Math.ceil(crx > clx ? crx : clx);
    // Clamp x to screen size
    base += startX < 0 ? startX * -1 * 4 : 0;
    startX = startX > 0 ? startX : 0;
    endX = endX < WIDTH ? endX : WIDTH - 1;
    for (let i = startX; i <= endX; i++) {
      plotPixel(imageData, base, color);
      base += 4;
    }

    crx -= dxr;
    clx -= dxl;
  }
};

export const drawTriangleFlatShade = (polygon, color, screen, imageData) => {
  const triangle = polygon.vertexIndices.map((idx) => {
    const { x, y } = screen[idx];
    return [x, y];
  });

  triangle.sort((a, b) => {
    return a[1] - b[1];
  });

  if (triangle[1][1] == triangle[2][1]) {
    fillTriangleFlatBottom(triangle, color, imageData);
  } else if (triangle[0][1] == triangle[1][1]) {
    fillTriangleFlatTop(triangle, color, imageData);
  } else {
    const v1 = [
      triangle[0][0] +
        ((triangle[2][0] - triangle[0][0]) *
          (triangle[1][1] - triangle[0][1])) /
          (triangle[2][1] - triangle[0][1]),
      triangle[1][1],
    ];
    fillTriangleFlatBottom([triangle[0], triangle[1], v1], color, imageData);
    fillTriangleFlatTop([triangle[1], v1, triangle[2]], color, imageData);
  }
};
