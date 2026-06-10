import { Vec3 } from "./Vec3";

export class Mat4 {
  constructor() {
    throw new Error(
      "Do not instantiate. This class only has static methods, like Math.",
    );
  }

  static identity() {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }

  static translation(x, y, z) {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1];
  }

  static rotationX(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [1, 0, 0, 0, 0, cos, sin, 0, 0, -sin, cos, 0, 0, 0, 0, 1];
  }

  static rotationY(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [cos, 0, -sin, 0, 0, 1, 0, 0, sin, 0, cos, 0, 0, 0, 0, 1];
  }

  static rotationZ(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [cos, sin, 0, 0, -sin, cos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }

  static scaling(scale) {
    return [scale, 0, 0, 0, 0, scale, 0, 0, 0, 0, scale, 0, 0, 0, 0, 1];
  }

  static perspective(d, ar) {
    return [d, 0, 0, 0, 0, d * ar, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0];
  }

  static multiply(m1, m2) {
    const result = new Array(16).fill(0);

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        for (let k = 0; k < 4; k++) {
          result[c + 4 * r] += m1[k + 4 * r] * m2[c + 4 * k];
        }
      }
    }

    return result;
  }

  // See LaMothe, p. 665
  static camera(target, pos) {
    const n = Vec3.sub(target, pos);
    let v = { x: 0, y: 1, z: 0 };
    const u = Vec3.cross(v, n);
    v = Vec3.cross(n, u);
    const nn = Vec3.normal(n);
    const nu = Vec3.normal(u);
    const nv = Vec3.normal(v);

    const camPosDotU = Vec3.dot(pos, nu);
    const camPosDotV = Vec3.dot(pos, nv);
    const camPosDotN = Vec3.dot(pos, nn);

    return [
      // Rotation
      nu.x,
      nv.x,
      nn.x,
      0,
      nu.y,
      nv.y,
      nn.y,
      0,
      nu.z,
      nv.z,
      nn.z,
      0,
      // Translation
      -camPosDotU,
      -camPosDotV,
      -camPosDotN,
      1,
    ];
  }

  static transformVec4(v, m) {
    return [
      v[0] * m[0] + v[1] * m[4] + v[2] * m[8] + v[3] * m[12],
      v[0] * m[1] + v[1] * m[5] + v[2] * m[9] + v[3] * m[13],
      v[0] * m[2] + v[1] * m[6] + v[2] * m[10] + v[3] * m[14],
      v[0] * m[3] + v[1] * m[7] + v[2] * m[11] + v[3] * m[15],
    ];
  }
}
