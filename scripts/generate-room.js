const base = {
  materials: {
    ambient: "#ffffff",
    diffuse: "#ffffff",
    // specular: "#ffffff",
  },
  uvs: [
    [0, 0],
    [0, 1],
    [1, 0],
  ],
};

const floorBase = {
  ...base,
  texture: "./assets/floor.png",
};

const wallBase = {
  ...base,
  texture: "./assets/wall.png",
};

const ceilingBase = {
  ...base,
  texture: "./assets/ceiling.jpg",
};

const generateRoom = (width = 8, breadth = 8, height = 4) => {
  const offsetX = width / 2;
  const offsetY = breadth / 2;
  const vertices = [];
  const polygons = [];

  // Floors and ceilings
  for (let i = 0; i < width; i += 1) {
    for (let j = 0; j < breadth; j += 1) {
      // Floor
      vertices.push([i - offsetX, -1, j - offsetY]); // -3
      vertices.push([i + 1 - offsetX, -1, j - offsetY]); // -2
      vertices.push([i + 1 - offsetX, -1, j + 1 - offsetY]); // -1
      vertices.push([i - offsetX, -1, j + 1 - offsetY]); // 0

      let len = vertices.length - 1;

      polygons.push({
        ...floorBase,
        vertexIndices: [len, len - 3, len - 1],
      });
      polygons.push({
        ...floorBase,
        uvs: [
          [1, 0],
          [0, 1],
          [1, 1],
        ],
        vertexIndices: [len - 1, len - 3, len - 2],
      });

      // Ceiling
      vertices.push([i - offsetX, height - 1, j - offsetY]); // -3
      vertices.push([i + 1 - offsetX, height - 1, j - offsetY]); // -2
      vertices.push([i + 1 - offsetX, height - 1, j + 1 - offsetY]); // -1
      vertices.push([i - offsetX, height - 1, j + 1 - offsetY]); // 0

      len = vertices.length - 1;

      polygons.push({
        ...ceilingBase,
        vertexIndices: [len - 3, len, len - 2],
      });
      polygons.push({
        ...ceilingBase,
        uvs: [
          [1, 0],
          [0, 1],
          [1, 1],
        ],
        vertexIndices: [len - 2, len, len - 1],
      });
    }
  }

  // Horizontal walls
  for (let j = 0; j < height; j++) {
    for (let i = 1; i <= width; i++) {
      vertices.push([i - 1 - offsetX, -1 + j, breadth - offsetY]);
      vertices.push([i - offsetX, -1 + j, breadth - offsetY]);
      vertices.push([i - offsetX, j, breadth - offsetY]);
      vertices.push([i - 1 - offsetX, j, breadth - offsetY]);

      let len = vertices.length - 1;

      polygons.push({
        ...wallBase,
        vertexIndices: [len, len - 3, len - 1],
      });
      polygons.push({
        ...wallBase,
        uvs: [
          [1, 0],
          [0, 1],
          [1, 1],
        ],
        vertexIndices: [len - 1, len - 3, len - 2],
      });

      vertices.push([i - 1 - offsetX, -1 + j, -offsetY]);
      vertices.push([i - offsetX, -1 + j, -offsetY]);
      vertices.push([i - offsetX, j, -offsetY]);
      vertices.push([i - 1 - offsetX, j, -offsetY]);

      len = vertices.length - 1;

      polygons.push({
        ...wallBase,
        vertexIndices: [len - 1, len - 2, len],
      });
      polygons.push({
        ...wallBase,
        uvs: [
          [1, 0],
          [0, 1],
          [1, 1],
        ],
        vertexIndices: [len, len - 2, len - 3],
      });
    }
  }

  // Vertical walls
  for (let j = 0; j < height; j++) {
    for (let i = 1; i <= breadth; i++) {
      vertices.push([-offsetX, -1 + j, breadth - offsetY - i]);
      vertices.push([-offsetX, -1 + j, breadth - offsetY - i + 1]);
      vertices.push([-offsetX, j, breadth - offsetY - i + 1]);
      vertices.push([-offsetX, j, breadth - offsetY - i]);

      let len = vertices.length - 1;

      polygons.push({
        ...wallBase,
        vertexIndices: [len, len - 3, len - 1],
      });
      polygons.push({
        ...wallBase,
        uvs: [
          [1, 0],
          [0, 1],
          [1, 1],
        ],
        vertexIndices: [len - 1, len - 3, len - 2],
      });

      vertices.push([offsetX, -1 + j, breadth - offsetY - i]);
      vertices.push([offsetX, -1 + j, breadth - offsetY - i + 1]);
      vertices.push([offsetX, j, breadth - offsetY - i + 1]);
      vertices.push([offsetX, j, breadth - offsetY - i]);

      len = vertices.length - 1;

      polygons.push({
        ...wallBase,
        vertexIndices: [len - 1, len - 2, len],
      });
      polygons.push({
        ...wallBase,
        uvs: [
          [1, 0],
          [0, 1],
          [1, 1],
        ],
        vertexIndices: [len, len - 2, len - 3],
      });
    }
  }

  return {
    vertices,
    polygons,
  };
};

const { vertices, polygons } = generateRoom(12, 12, 2);

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
