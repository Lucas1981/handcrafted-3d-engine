import { Polygon } from "./Polygon";
// import { Mat4 } from "../math/Mat4";

export class Mesh3D {
  constructor(data) {
    this.pos = { x: 0, y: 0, z: 0 };
    this.rot = { x: 0, y: 0, z: 0 };
    this.scale = 1;
    this.vlist = JSON.parse(JSON.stringify(data.vertices));
    this.plist = data.polygons.map((polygon) => new Polygon(polygon));
  }

  setPosition(pos) {
    this.pos = { ...pos };
  }

  setRotation(rot) {
    this.rot = { ...rot };
  }

  setScale(scale) {
    this.scale = scale;
  }

  //   getModelMatrix() {
  //     const T = Mat4.translation(this.pos.x, this.pos.y, this.pos.z);
  //     const Rx = Mat4.rotationX(this.rot.x);
  //     const Ry = Mat4.rotationY(this.rot.y);
  //     const Rz = Mat4.rotationZ(this.rot.z);
  //     const S = Mat4.scaling(this.scale);
  //     return Mat4.multiply(
  //       T,
  //       Mat4.multiply(Rx, Mat4.multiply(Ry, Mat4.multiply(Rz, S))),
  //     );
  //   }
}
