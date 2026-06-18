/**
 * So this file is not meant to be used, it is here to illustrate the most basic shader. So that means
 * a flat shader where we don't do clamping or z-buffering. It's meant to illustrate the easiest setup for
 * a shader to then elaborate on. It's really quite simple. It gets complex when you start interpolating
 * values mainly.
 */
import { plotPixel, orderLeftToRight } from "./utils";
import { WIDTH, HEIGHT } from "../../constants";

const fillTriangleFlatBottom = (triangle, color, contextData) => {
  const dxl =
    (triangle[0][0] - triangle[2][0]) / (triangle[0][1] - triangle[2][1]);
  const dxr =
    (triangle[0][0] - triangle[1][0]) / (triangle[0][1] - triangle[1][1]);
  const clx = triangle[0][0];
  const crx = triangle[0][0];

  for (let cy = triangle[0][1]; cy <= triangle[2][1]; cy++) {
    let base = (cy * contextData.width + Math.ceil(clx)) * 4;
    for (let i = Math.ceil(clx); i <= Math.ceil(crx); i++) {
      contextData.data[base++] = color[0];
      contextData.data[base++] = color[1];
      contextData.data[base++] = color[2];
      contextData.data[base++] = color[3];
    }

    crx += dxr;
    clx += dxl;
  }
};

const fillTriangleFlatTop = (triangle, color, contextData) => {
  const dxl =
    (triangle[2][0] - triangle[0][0]) / (triangle[2][1] - triangle[0][1]);
  const dxr =
    (triangle[2][0] - triangle[1][0]) / (triangle[2][1] - triangle[1][1]);
  const clx = triangle[2][0];
  const crx = triangle[2][0];

  for (let cy = triangle[2][1]; cy >= triangle[0][1]; cy--) {
    let base = (cy * contextData.width + Math.ceil(clx)) * 4;
    for (let i = Math.ceil(clx); i <= Math.ceil(crx); i++) {
      contextData.data[base++] = color[0];
      contextData.data[base++] = color[1];
      contextData.data[base++] = color[2];
      contextData.data[base++] = color[3];
    }

    crx -= dxr;
    clx -= dxl;
  }
};

const drawGeneralTriangle = (triangle, color, contextData) => {
  triangle.sort((a, b) => {
    return a[1] - b[1];
  });

  const [top, mid, bottom] = triangle;

  if (triangle[1][1] == triangle[2][1]) {
    const [left, right] = orderLeftToRight(mid, bottom);
    fillTriangleFlatBottom([top, left, right], color, contextData);
  } else if (triangle[0][1] == triangle[1][1]) {
    const [left, right] = orderLeftToRight(top, mid);
    fillTriangleFlatTop([left, right, bottom], color, contextData);
  } else {
    const v1 = [
      triangle[0][0] +
        ((triangle[2][0] - triangle[0][0]) *
          (triangle[1][1] - triangle[0][1])) /
          (triangle[2][1] - triangle[0][1]),
      triangle[1][1],
    ];

    const [left, right] = orderLeftToRight(mid, v1);
    fillTriangleFlatBottom([top, left, right], color, contextData);
    fillTriangleFlatTop([left, right, bottom], color, contextData);
  }
};
