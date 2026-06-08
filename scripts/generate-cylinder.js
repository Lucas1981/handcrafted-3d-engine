const degToRad = Math.PI / 180;

const sides = 10;
const turns = 5;
const amp = 1;
const freq = 1;

let object = {
  vertices: [],
  polygons: [],
};
let polygonCounter = 0;

for (let j = 0; j < turns; j++) {
  for (let i = 0; i < sides; i++) {
    object.vertices[j * sides + i] = [
      (100 + Math.sin(((freq * 360) / turns) * j * degToRad) * amp) *
        Math.sin((360 / sides) * i * degToRad),
      (100 + Math.sin(((freq * 360) / turns) * j * degToRad) * amp) *
        Math.cos((360 / sides) * i * degToRad),
      j * 20,
    ];

    if (j != 0 && i != 0) {
      object.polygons[polygonCounter] = { vertexIndices: [] };
      object.polygons[polygonCounter].vertexIndices[0] =
        (j - 1) * sides + (i - 1);
      object.polygons[polygonCounter].vertexIndices[1] = (j - 1) * sides + i;
      object.polygons[polygonCounter].vertexIndices[2] = j * sides + i;
      object.polygons[polygonCounter].vertexIndices[3] = j * sides + (i - 1);
      object.polygons[polygonCounter].color = [
        Math.floor(Math.random() * 360),
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
      ];

      polygonCounter++;
    }

    if (j != 0 && i == sides - 1) {
      object.polygons[polygonCounter] = { vertexIndices: [] };
      object.polygons[polygonCounter].vertexIndices[0] = (j - 1) * sides + i;
      object.polygons[polygonCounter].vertexIndices[1] = (j - 1) * sides;
      object.polygons[polygonCounter].vertexIndices[2] = j * sides;
      object.polygons[polygonCounter].vertexIndices[3] = j * sides + i;
      object.polygons[polygonCounter].color = [
        Math.floor(Math.random() * 360),
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
      ];

      polygonCounter++;
    }
  }
}

console.log(JSON.stringify(object, null, 2));
