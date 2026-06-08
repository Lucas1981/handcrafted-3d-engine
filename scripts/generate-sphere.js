const degToRad = (deg) => deg * (Math.PI / 180);

const radius = 1;
const sides = 32;
const color = "#0000ff";

const vertices = [];
const polygons = [];

for (let i = 0; i <= sides; i++) {
  const r = Math.sin(degToRad((180 / sides) * i)) * radius;
  for (let j = 0; j < sides; j++) {
    const x1 = Math.cos(degToRad((180 / sides) * i)) * radius;
    const y1 = Math.sin(degToRad((360 / sides) * j)) * r;
    const z1 = Math.cos(degToRad((360 / sides) * j)) * r;

    vertices.push([x1, y1, z1]);

    if (i > 0) {
      polygons.push({
        vertexIndices: [
          (i - 1) * sides + ((j + 1) % sides),
          (i - 1) * sides + j,
          i * sides + j,
        ],
        color,
      });

      polygons.push({
        vertexIndices: [
          (i - 1) * sides + ((j + 1) % sides),
          i * sides + j,
          i * sides + ((j + 1) % sides),
        ],
        color,
      });
    }
  }
}

console.log(
  JSON.stringify(
    {
      vertices,
      polygons,
    },
    null,
    2,
  ),
);
