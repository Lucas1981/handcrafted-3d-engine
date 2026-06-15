import { Polygon } from "./Polygon";
import { Mat4 } from "../math/Mat4";
import { Vec3 } from "../math/Vec3";

export class Mesh3D {
  constructor(data) {
    this.pos = { x: 0, y: 0, z: 0 };
    this.rot = { x: 0, y: 0, z: 0 };
    this.scale = 1;
    this.vlist = JSON.parse(JSON.stringify(data.vertices));
    this.plist = data.polygons.map((polygon, idx) => new Polygon(polygon, idx));
    this.maxRadius = this.vlist
      .map(([x, y, z]) => ({ x, y, z }))
      .reduce((acc, curr) => {
        const currLen = Math.abs(Vec3.len(curr));
        return currLen > acc ? currLen : acc;
      }, 0);
  }

  getPosition() {
    return this.pos;
  }

  setPosition(pos) {
    this.pos = { ...pos };
  }

  getRotation() {
    return this.rot;
  }

  setRotation(rot) {
    this.rot = { ...rot };
  }

  getScale() {
    return this.scale;
  }

  setScale(scale) {
    this.scale = scale;
  }

  getMaxRadius() {
    return this.maxRadius;
  }

  getModelMatrix() {
    const T = Mat4.translation(this.pos.x, this.pos.y, this.pos.z);
    const Rx = Mat4.rotationX(this.rot.x);
    const Ry = Mat4.rotationY(this.rot.y);
    const Rz = Mat4.rotationZ(this.rot.z);
    const S = Mat4.scaling(this.scale);
    return Mat4.multiply(
      S,
      Mat4.multiply(Rz, Mat4.multiply(Ry, Mat4.multiply(Rx, T))),
    );
  }
}
