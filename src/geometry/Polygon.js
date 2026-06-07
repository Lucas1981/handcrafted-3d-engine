export class Polygon {
  constructor(data) {
    this.color = data.color;
    this.vertexIndices = [...data.vertexIndices];
    this.texture = data?.texture || null;
    this.uvs = data?.uvs ? JSON.parse(JSON.stringify(data.uvs)) : null;
  }
}
