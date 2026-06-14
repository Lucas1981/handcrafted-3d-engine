export const plotPixel = (imageData, base, color) => {
  imageData.data[base] = color[0];
  imageData.data[base + 1] = color[1];
  imageData.data[base + 2] = color[2];
  imageData.data[base + 3] = color[3];
};

export const hexToDec = (color) => {
  if (color.length !== 7) {
    throw new Error("Not a valid hex color value");
  }

  const r = Number(`0x${color.slice(1, 3)}`);
  const g = Number(`0x${color.slice(3, 5)}`);
  const b = Number(`0x${color.slice(5, 7)}`);

  return [r, g, b, 255];
};
