export class Polygon {
  constructor(data, index) {
    this.id = index;
    this.color = data.color;
    this.vertexIndices = [...data.vertexIndices];
    this.texture = data?.texture || null;
    this.uvs = data?.uvs ? JSON.parse(JSON.stringify(data.uvs)) : null;
  }
}
