const degToRad = (deg) => deg * (Math.PI / 180);

const sides = 15;
const turns = 15;
const thickness = 6;
const reach = 30;
const materials = {
  ambient: "#0000ff",
  diffuse: "#ff0000",
};

const vertices = [];
const polygons = [];

for (let i = 0; i < sides; i++) {
  // First, find the angles around which to build the points
  const ax = Math.sin(degToRad((360 / sides) * i));
  const az = Math.cos(degToRad((360 / sides) * i));

  // Then, register the spots around each turn
  for (let j = 0; j < turns; j++) {
    const r = Math.sin(degToRad((360 / turns) * j)) * thickness;
    let x1 = ax * (reach + r);
    let z1 = az * (reach + r);
    const y1 = Math.cos(degToRad((360 / turns) * j)) * thickness;
    vertices.push([x1, y1, z1]);

    // Register all the polygons
    polygons.push({
      vertexIndices: [
        turns * i + j,
        turns * ((i + 1) % sides) + ((j + 1) % turns),
        turns * i + ((j + 1) % turns),
      ],
      materials,
    });

    polygons.push({
      vertexIndices: [
        turns * i + j,
        turns * ((i + 1) % sides) + j,
        turns * ((i + 1) % sides) + ((j + 1) % turns),
      ],
      materials,
    });
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
