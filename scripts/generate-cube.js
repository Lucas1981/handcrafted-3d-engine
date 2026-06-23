const size = 2;
const color = "#ffffff";
const object = {
  vertices: [],
  polygons: [],
};
let polygonCounter = 0;
const halfSize = size / 2;

object.vertices = [
  [-halfSize, -halfSize, -halfSize],
  [halfSize, -halfSize, -halfSize],
  [halfSize, halfSize, -halfSize],
  [-halfSize, halfSize, -halfSize],

  [-halfSize, -halfSize, halfSize],
  [halfSize, -halfSize, halfSize],
  [halfSize, halfSize, halfSize],
  [-halfSize, halfSize, halfSize],
];

const indices = ["a+b", "c+d", "e+f", "g+h", "i+j", "k+l"];

for (let i = 0; i < 12; i++) {
  object.polygons[i] = { vertexIndices: [] };
  // object.polygons[i].color = color;
  object.polygons[i].texture =
    `./assets/wall-colored-${indices[parseInt(i / 2)]}.png`;
  object.polygons[i].materials = {
    ambient: "#ffffff",
    diffuse: color,
  };
  object.polygons[i].uvs =
    i % 2
      ? [
          [0, 0],
          [1, 1],
          [1, 0],
        ]
      : [
          [0, 0],
          [0, 1],
          [1, 1],
        ];
}

object.polygons[0].vertexIndices = [0, 1, 2];
object.polygons[1].vertexIndices = [0, 2, 3];
object.polygons[2].vertexIndices = [4, 7, 6];
object.polygons[3].vertexIndices = [4, 6, 5];
object.polygons[4].vertexIndices = [0, 3, 7];
object.polygons[5].vertexIndices = [0, 7, 4];
object.polygons[6].vertexIndices = [0, 4, 5];
object.polygons[7].vertexIndices = [0, 5, 1];
object.polygons[8].vertexIndices = [1, 5, 6];
object.polygons[9].vertexIndices = [1, 6, 2];
object.polygons[10].vertexIndices = [3, 2, 6];
object.polygons[11].vertexIndices = [3, 6, 7];

console.log(JSON.stringify(object, null, 2));
