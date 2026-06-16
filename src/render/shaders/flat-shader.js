import { plotPixel, getNewPointValue } from "./utils";
import { WIDTH, HEIGHT } from "../../constants";

const fillTriangleFlatBottom = (triangle, color, imageData, zBuffer) => {
  // 1. Set up basic conditions

  if (triangle[2][0] < triangle[1][0]) {
    const tmp = triangle[2];
    triangle[2] = triangle[1];
    triangle[1] = tmp;
  }

  let dxl =
    (triangle[0][0] - triangle[2][0]) / (triangle[0][1] - triangle[2][1]);
  let dxr =
    (triangle[0][0] - triangle[1][0]) / (triangle[0][1] - triangle[1][1]);

  if (dxl > dxr) {
    const tmp = dxl;
    dxl = dxr;
    dxr = tmp;
  }

  let clx = triangle[0][0];
  let crx = triangle[0][0];
  let startY = triangle[0][1];
  let endY = triangle[2][1];

  // Aliases
  const y1 = triangle[0][1];
  const y2 = triangle[1][1];
  const y3 = triangle[2][1];

  // 2. Set up interpolants (only the z buffer for the flat shader)

  const syz1 = triangle[0][2];
  const eyz1 = triangle[1][2];
  const syz2 = triangle[0][2]; // same as syz1
  const eyz2 = triangle[2][2];

  // Calculate the slopes for the z-buffer values
  const dyz1 = (eyz1 - syz1) / Math.abs(y2 - y1);
  const dyz2 = (eyz2 - syz2) / Math.abs(y3 - y1);

  let z1 = syz1;
  let z2 = syz2;

  // 3. Clamp y to screen size (must be done here to potentially compensate interpolants)

  endY = endY < HEIGHT ? endY : HEIGHT - 1;
  if (startY < 0) {
    crx += dxr * startY * -1;
    clx += dxl * startY * -1;
    z1 += dyz1 * startY * -1;
    z2 += dyz2 * startY * -1;
    startY = 0;
  }

  // 4. Run the loop

  for (let cy = startY; cy <= endY; cy++) {
    const dzx = (z2 - z1) / (crx - clx);
    let z = z1;

    let base = (cy * imageData.width + Math.ceil(crx > clx ? clx : crx)) * 4;
    let startX = Math.ceil(crx > clx ? clx : crx);
    let endX = Math.ceil(crx > clx ? crx : clx);
    // Clamp x to screen size
    base += startX < 0 ? startX * -1 * 4 : 0;
    z += startX < 0 ? startX * -1 * dzx : 0;
    startX = startX > 0 ? startX : 0;
    endX = endX < WIDTH ? endX : WIDTH - 1;
    for (let i = startX; i <= endX; i++) {
      const zBufferBase = base / 4;
      if (zBuffer[zBufferBase] < z) {
        zBuffer[zBufferBase] = z;
        plotPixel(imageData, base, color);
      }
      base += 4;
      z += dzx;
    }

    z1 += dyz1;
    z2 += dyz2;
    crx += dxr;
    clx += dxl;
  }
};

const fillTriangleFlatTop = (triangle, color, imageData, zBuffer) => {
  // 1. Set up basic conditions

  if (triangle[0][0] > triangle[1][0]) {
    const tmp = triangle[0];
    triangle[0] = triangle[1];
    triangle[1] = tmp;
  }

  const dxl =
    (triangle[2][0] - triangle[0][0]) / (triangle[2][1] - triangle[0][1]);
  const dxr =
    (triangle[2][0] - triangle[1][0]) / (triangle[2][1] - triangle[1][1]);

  // NOTE: we don't swap dxl and dxr here, like we do in fillTriangleFlatBottom

  let clx = triangle[2][0];
  let crx = triangle[2][0];
  let startY = triangle[2][1];
  let endY = triangle[0][1];

  // Aliases
  const y1 = triangle[2][1];
  const y2 = triangle[1][1];
  const y3 = triangle[0][1];

  // 2. Set up interpolants (only the z buffer for the flat shader)

  const syz1 = triangle[2][2];
  const eyz1 = triangle[0][2];
  const syz2 = triangle[2][2];
  const eyz2 = triangle[1][2];

  // Calculate the slopes for the z-buffer values
  const dyz1 = (eyz1 - syz1) / (y1 - y2);
  const dyz2 = (eyz2 - syz2) / (y1 - y3);

  let z1 = syz1;
  let z2 = syz2;

  // 3. Clamp y to screen size (must be done here to potentially compensate interpolants)

  endY = endY < 0 ? 0 : endY;
  if (startY > HEIGHT) {
    const diff = startY - HEIGHT;
    crx -= dxr * diff;
    clx -= dxl * diff;
    z1 += dyz1 * diff;
    z2 += dyz2 * diff;
    startY = HEIGHT - 1;
  }

  // 4. Run the loop

  for (let cy = startY; cy >= endY; cy--) {
    const dzx = (z2 - z1) / (crx - clx);
    let z = z1;
    let base = (cy * imageData.width + Math.ceil(crx > clx ? clx : crx)) * 4;
    let startX = Math.ceil(crx > clx ? clx : crx);
    let endX = Math.ceil(crx > clx ? crx : clx);
    // Clamp x to screen size
    base += startX < 0 ? startX * -1 * 4 : 0;
    z += startX < 0 ? startX * -1 * dzx : 0;
    startX = startX > 0 ? startX : 0;
    endX = endX < WIDTH ? endX : WIDTH - 1;
    for (let i = startX; i <= endX; i++) {
      const zBufferBase = base / 4;
      if (zBuffer[zBufferBase] < z) {
        zBuffer[zBufferBase] = z;
        plotPixel(imageData, base, color);
      }
      z += dzx;
      base += 4;
    }

    crx -= dxr;
    clx -= dxl;
    z1 += dyz1;
    z2 += dyz2;
  }
};

export const drawTriangleFlatShade = (
  polygon,
  color,
  screen,
  imageData,
  zBuffer,
) => {
  const triangle = polygon.vertexIndices.map((idx) => {
    const { x, y, depth } = screen[idx];
    return [x, y, depth];
  });

  triangle.sort((a, b) => {
    return a[1] - b[1];
  });

  if (triangle[1][1] == triangle[2][1]) {
    fillTriangleFlatBottom(triangle, color, imageData, zBuffer);
  } else if (triangle[0][1] == triangle[1][1]) {
    fillTriangleFlatTop(triangle, color, imageData, zBuffer);
  } else {
    const v1 = [
      getNewPointValue(triangle, 0),
      triangle[1][1],
      getNewPointValue(triangle, 2),
    ];
    fillTriangleFlatBottom(
      [triangle[0], triangle[1], v1],
      color,
      imageData,
      zBuffer,
    );
    fillTriangleFlatTop(
      [triangle[1], v1, triangle[2]],
      color,
      imageData,
      zBuffer,
    );
  }
};
