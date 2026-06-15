import { plotPixel } from "./utils";

const fillTriangleFlatBottom = (triangle, color, imageData) => {
  const dxl =
    (triangle[0][0] - triangle[2][0]) / (triangle[0][1] - triangle[2][1]);
  const dxr =
    (triangle[0][0] - triangle[1][0]) / (triangle[0][1] - triangle[1][1]);

  let clx = triangle[0][0];
  let crx = triangle[0][0];

  for (let cy = triangle[0][1]; cy <= triangle[2][1]; cy++) {
    let base = (cy * imageData.width + Math.ceil(crx > clx ? clx : crx)) * 4;
    for (
      let i = Math.ceil(crx > clx ? clx : crx);
      i <= Math.ceil(crx > clx ? crx : clx);
      i++
    ) {
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

  for (let cy = triangle[2][1]; cy >= triangle[0][1]; cy--) {
    let base = (cy * imageData.width + Math.ceil(crx > clx ? clx : crx)) * 4;
    for (
      let i = Math.ceil(crx > clx ? clx : crx);
      i <= Math.ceil(crx > clx ? crx : clx);
      i++
    ) {
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
    return [parseInt(x), parseInt(y)];
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
