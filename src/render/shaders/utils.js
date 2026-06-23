export const plotPixel = (imageData, base, color) => {
  imageData.data[base] = color[0];
  imageData.data[base + 1] = color[1];
  imageData.data[base + 2] = color[2];
  imageData.data[base + 3] = color[3];
};

export const getTexel = (imageData, base) => [
  imageData.data[base],
  imageData.data[base + 1],
  imageData.data[base + 2],
  imageData.data[base + 3],
];

export const blendColor = (c1, c2) => [
  (c1[0] / 255) * c2[0],
  (c1[1] / 255) * c2[2],
  (c1[2] / 255) * c2[2],
];

export const hexToDec = (color) => {
  if (color.length !== 7) {
    throw new Error("Not a valid hex color value");
  }

  const r = Number(`0x${color.slice(1, 3)}`);
  const g = Number(`0x${color.slice(3, 5)}`);
  const b = Number(`0x${color.slice(5, 7)}`);

  return [r, g, b, 255];
};

export const getNewPointValue = (triangle, index) =>
  triangle[0][index] +
  ((triangle[2][index] - triangle[0][index]) *
    (triangle[1][1] - triangle[0][1])) /
    (triangle[2][1] - triangle[0][1]);

export const addScaledInPlace = (src, dest, scale = 1) => {
  for (let i = 0; i < src.length; i++) {
    dest[i] = dest[i] + src[i] * scale;
  }
};

export const copyInPlace = (src, dest) => {
  for (let i = 0; i < src.length; i++) {
    dest[i] = src[i];
  }
};

export const setDnx = (out, left, right, denom) => {
  for (let i = 0; i < out.length; i++) {
    out[i] = (right[i] - left[i]) / denom;
  }
};

export const orderLeftToRight = (a, b) => {
  return a[0] < b[0] ? [a, b] : [b, a];
};
