import { hexToDec } from "../render/shaders/utils";

export class Polygon {
  constructor(data, id, textureMap) {
    this.id = id;
    this.data = data; // Keep a raw copy so we can clone
    this.materials = Object.entries(data?.materials || {}).reduce(
      (acc, curr) => ({
        ...acc,
        [curr[0]]: hexToDec(curr[1]),
      }),
      {},
    );
    this.vertexIndices = [...data.vertexIndices];
    this.textureMap = textureMap;
    this.textureKey = null;
    if (data?.texture) {
      this.textureKey = data.texture;

      if (!textureMap[this.textureKey]) {
        textureMap.loadTexture(this.textureKey);
      }
    }
    this.uvs = data?.uvs ? JSON.parse(JSON.stringify(data.uvs)) : null;
    this.lighting = [];
  }

  getTexture() {
    if (this.textureKey === null) {
      throw new Error("Texture key is null");
    }

    return this.textureMap.getTexture(this.textureKey);
  }

  setVertexIndices(vertexIndices) {
    this.vertexIndices = [...vertexIndices];
  }

  setLighting(lighting) {
    this.lighting = lighting;
  }

  setUvs(uvs) {
    this.uvs = uvs;
  }

  getClone() {
    return Object.create(this);
  }
}
