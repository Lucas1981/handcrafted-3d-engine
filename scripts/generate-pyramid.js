const scale = 1;
const radius = 1;
const color = "red";

const pyramid = {
  vertices: [
    [0, 1 * scale * radius, 0], // top
    [1 * scale, 0, -1 * scale],
    [1 * scale, 0, 1 * scale],
    [-1 * scale, 0, 1 * scale],
    [-1 * scale, 0, -1 * scale],
  ],
  polygons: [
    { vertexIndices: [3, 2, 1], color },
    { vertexIndices: [4, 3, 1], color },
    { vertexIndices: [0, 1, 2], color },
    { vertexIndices: [0, 2, 3], color },
    { vertexIndices: [0, 3, 4], color },
    { vertexIndices: [0, 4, 1], color },
  ],
};

console.log(JSON.stringify(pyramid, null, 2));
