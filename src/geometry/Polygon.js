import { hexToDec } from "../render/shaders/utils";

export class Polygon {
  constructor(data, index) {
    this.id = index;
    this.materials = Object.entries(data?.materials || {}).reduce(
      (acc, curr) => ({
        ...acc,
        [curr[0]]: hexToDec(curr[1]),
      }),
      {},
    );
    this.vertexIndices = [...data.vertexIndices];
    this.texture = data?.texture || null;
    this.uvs = data?.uvs ? JSON.parse(JSON.stringify(data.uvs)) : null;
  }
}
