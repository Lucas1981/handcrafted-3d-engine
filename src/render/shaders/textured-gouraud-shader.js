import {
  plotPixel,
  getNewPointValue,
  addScaledInPlace,
  copyInPlace,
  setDnx,
  orderLeftToRight,
  getTexel,
} from "./utils";
import { WIDTH, HEIGHT } from "../../constants";

const LOWEST_VALUE_CRX_CLX_DIFF = 0.01;
const Z_BUFFER_INDEX = 0;
const RED_INDEX = 1;
const GREEN_INDEX = 2;
const BLUE_INDEX = 3;
const U_INDEX = 4;
const V_INDEX = 5;
const N_MAX = 6;

const interps = new Array(N_MAX).fill(0);
const dnx = new Array(N_MAX).fill(0);
const multiplyColors = (c1, c2) => [
  (c1[0] / 255) * c2[0],
  (c1[1] / 255) * c2[1],
  (c1[2] / 255) * c2[2],
  255,
];

// Starts at the top, then works on down.
const fillTriangleTexturedGouraudFlatBottom = (
  triangle,
  imageData,
  zBuffer,
  texture,
) => {
  // 1. Set up basic conditions

  const dxl =
    (triangle[0][0] - triangle[1][0]) / (triangle[0][1] - triangle[1][1]);
  const dxr =
    (triangle[0][0] - triangle[2][0]) / (triangle[0][1] - triangle[2][1]);

  let clx = triangle[0][0];
  let crx = triangle[0][0];
  let startY = triangle[0][1];
  let endY = triangle[2][1];

  // 2. Set up interpolants

  const sy1 = [...triangle[0].slice(2)]; // Everything in the triangle arr beyond x and y
  const ey1 = [...triangle[1].slice(2)];
  const sy2 = [...triangle[0].slice(2)];
  const ey2 = [...triangle[2].slice(2)];
  const interps1 = [...sy1];
  const interps2 = [...sy2];

  // Calculate the slopes
  const y1 = triangle[0][1];
  const y2 = triangle[1][1];
  const y3 = triangle[2][1];
  const dy1 = sy1.map((syn1, index) => (ey1[index] - syn1) / Math.abs(y2 - y1));
  const dy2 = sy2.map((syn2, index) => (ey2[index] - syn2) / Math.abs(y3 - y1));

  // 3. Clamp y to screen size (must be done here to potentially compensate interpolants)

  endY = endY < HEIGHT ? endY : HEIGHT - 1;
  if (startY < 0) {
    crx += dxr * startY * -1;
    clx += dxl * startY * -1;
    addScaledInPlace(dy1, interps1, startY * -1);
    addScaledInPlace(dy2, interps2, startY * -1);
    startY = 0;
  }

  // 4. Run the loop

  for (let cy = Math.round(startY); cy <= Math.round(endY); cy++) {
    setDnx(dnx, interps1, interps2, crx - clx || LOWEST_VALUE_CRX_CLX_DIFF);
    copyInPlace(interps1, interps);
    let startX = Math.round(clx);
    let base = (cy * imageData.width + startX) * 4;
    let endX = Math.round(crx);
    // Clamp x to screen size
    base += startX < 0 ? startX * -1 * 4 : 0;
    if (startX < 0) {
      addScaledInPlace(dnx, interps, startX * -1);
    }
    startX = startX > 0 ? startX : 0;
    endX = endX < WIDTH ? endX : WIDTH - 1;
    for (let i = startX; i <= endX; i++) {
      const zBufferBase = base / 4;
      const depth = interps[Z_BUFFER_INDEX];
      if (zBuffer[zBufferBase] < depth) {
        zBuffer[zBufferBase] = depth;
        const color = [
          Math.round(interps[RED_INDEX]),
          Math.round(interps[GREEN_INDEX]),
          Math.round(interps[BLUE_INDEX]),
          255,
        ];

        const u = (interps[U_INDEX] / depth) * texture.width;
        const v = (interps[V_INDEX] / depth) * texture.height;
        const tu = Math.max(Math.min(Math.round(u), texture.width - 1), 0);
        const tv = Math.max(Math.min(Math.round(v), texture.height - 1), 0);
        const textelBase = Math.round(tu + tv * texture.width) * 4;
        const texel = getTexel(texture, textelBase);
        const finalColor = multiplyColors(color, texel);

        plotPixel(imageData, base, finalColor);
      }
      base += 4;
      addScaledInPlace(dnx, interps);
    }

    addScaledInPlace(dy1, interps1);
    addScaledInPlace(dy2, interps2);
    crx += dxr;
    clx += dxl;
  }
};

const fillTriangleTexturedGouraudFlatTop = (
  triangle,
  imageData,
  zBuffer,
  texture,
) => {
  // 1. Set up basic conditions

  const dxl =
    (triangle[2][0] - triangle[0][0]) / (triangle[2][1] - triangle[0][1]);
  const dxr =
    (triangle[2][0] - triangle[1][0]) / (triangle[2][1] - triangle[1][1]);

  let clx = triangle[2][0];
  let crx = triangle[2][0];
  let startY = triangle[2][1];
  let endY = triangle[0][1];

  // 2. Set up interpolants

  const sy1 = [...triangle[2].slice(2)];
  const ey1 = [...triangle[0].slice(2)];
  const sy2 = [...triangle[2].slice(2)];
  const ey2 = [...triangle[1].slice(2)];
  const interps1 = [...sy1];
  const interps2 = [...sy2];

  // Calculate the slopes
  const y1 = triangle[2][1];
  const y2 = triangle[1][1];
  const y3 = triangle[0][1];
  const dy1 = sy1.map((syn1, index) => (ey1[index] - syn1) / (y1 - y2));
  const dy2 = sy2.map((syn2, index) => (ey2[index] - syn2) / (y1 - y3));

  // 3. Clamp y to screen size (must be done here to potentially compensate interpolants)

  endY = endY < 0 ? 0 : endY;
  if (startY > HEIGHT) {
    const diff = startY - HEIGHT;
    crx -= dxr * diff;
    clx -= dxl * diff;
    addScaledInPlace(dy1, interps1, diff);
    addScaledInPlace(dy2, interps2, diff);
    startY = HEIGHT - 1;
  }

  // 4. Run the loop

  for (let cy = Math.round(startY); cy >= Math.round(endY); cy--) {
    setDnx(dnx, interps1, interps2, crx - clx || LOWEST_VALUE_CRX_CLX_DIFF);
    copyInPlace(interps1, interps);
    let startX = Math.round(clx);
    let base = (cy * imageData.width + startX) * 4;
    let endX = Math.round(crx);
    // Clamp x to screen size
    base += startX < 0 ? startX * -1 * 4 : 0;
    if (startX < 0) {
      addScaledInPlace(dnx, interps, startX * -1);
    }
    startX = startX > 0 ? startX : 0;
    endX = endX < WIDTH ? endX : WIDTH - 1;
    for (let i = startX; i <= endX; i++) {
      const zBufferBase = base / 4;
      const depth = interps[Z_BUFFER_INDEX];
      if (zBuffer[zBufferBase] < depth) {
        zBuffer[zBufferBase] = depth;
        const color = [
          Math.round(interps[RED_INDEX]),
          Math.round(interps[GREEN_INDEX]),
          Math.round(interps[BLUE_INDEX]),
          255,
        ];

        const u = (interps[U_INDEX] / depth) * texture.width;
        const v = (interps[V_INDEX] / depth) * texture.height;
        const tu = Math.max(Math.min(Math.round(u), texture.width - 1), 0);
        const tv = Math.max(Math.min(Math.round(v), texture.height - 1), 0);
        const textelBase = Math.round(tu + tv * texture.width) * 4;
        const texel = getTexel(texture, textelBase);
        const finalColor = multiplyColors(color, texel);

        plotPixel(imageData, base, finalColor);
      }
      addScaledInPlace(dnx, interps);
      base += 4;
    }

    crx -= dxr;
    clx -= dxl;
    addScaledInPlace(dy1, interps1);
    addScaledInPlace(dy2, interps2);
  }
};

export const drawTriangleTexturedGouraudShaded = (
  polygon,
  colors,
  screen,
  imageData,
  zBuffer,
) => {
  const texture = polygon.getTexture();

  const triangle = polygon.vertexIndices.map((vertexIndex, index) => {
    const { x, y, depth } = screen[vertexIndex];
    const [r, g, b] = colors[index];
    const [u, v] = polygon.uvs[index];
    return [x, y, depth, r, g, b, u * depth, v * depth];
  });

  triangle.sort((a, b) => {
    return a[1] - b[1];
  });

  // Extract vertices top-to-bottom so we can also x-sort the non-apex vertices for each case
  const [top, mid, bottom] = triangle;

  if (triangle[1][1] == triangle[2][1]) {
    const [left, right] = orderLeftToRight(mid, bottom);
    fillTriangleTexturedGouraudFlatBottom(
      [top, left, right],
      imageData,
      zBuffer,
      texture,
    );
  } else if (triangle[0][1] == triangle[1][1]) {
    const [left, right] = orderLeftToRight(top, mid);
    fillTriangleTexturedGouraudFlatTop(
      [left, right, bottom],
      imageData,
      zBuffer,
      texture,
    );
  } else {
    const v1 = [
      getNewPointValue(triangle, 0), // x
      triangle[1][1],
      getNewPointValue(triangle, 2), // depth
      getNewPointValue(triangle, 3), // r
      getNewPointValue(triangle, 4), // g
      getNewPointValue(triangle, 5), // b
      getNewPointValue(triangle, 6), // u
      getNewPointValue(triangle, 7), // v
    ];

    const [left, right] = orderLeftToRight(mid, v1);
    fillTriangleTexturedGouraudFlatBottom(
      [top, left, right],
      imageData,
      zBuffer,
      texture,
    );
    fillTriangleTexturedGouraudFlatTop(
      [left, right, bottom],
      imageData,
      zBuffer,
      texture,
    );
  }
};
