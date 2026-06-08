const size = 2;
const color = "#ff0000";
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

for (let i = 0; i < 12; i++) {
  object.polygons[i] = { vertexIndices: [] };
  object.polygons[i].color = color;
}

object.polygons[0].vertexIndices = [0, 1, 2];
object.polygons[1].vertexIndices = [0, 2, 3];
object.polygons[2].vertexIndices = [4, 5, 6];
object.polygons[3].vertexIndices = [4, 6, 7];
object.polygons[4].vertexIndices = [0, 3, 7];
object.polygons[5].vertexIndices = [0, 7, 4];
object.polygons[6].vertexIndices = [0, 1, 5];
object.polygons[7].vertexIndices = [0, 5, 4];
object.polygons[8].vertexIndices = [1, 2, 6];
object.polygons[9].vertexIndices = [1, 6, 5];
object.polygons[10].vertexIndices = [3, 2, 6];
object.polygons[11].vertexIndices = [3, 6, 7];

console.log(JSON.stringify(object, null, 2));
