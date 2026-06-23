import { hexToDec } from "../render/shaders/utils";

export class Polygon {
  constructor(data, index, textureMap) {
    this.id = index;
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
  }

  getTexture() {
    if (this.textureKey === null) {
      throw new Error("Texture key is null");
    }

    return this.textureMap.getTexture(this.textureKey);
  }
}
