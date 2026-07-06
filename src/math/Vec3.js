export const vertArrToObj = (arr) => {
  const [x, y, z] = arr;
  return { x, y, z };
};

export class Vec3 {
  constructor() {
    throw new Error(
      "Do not instantiate. This class only has static methods, like Math.",
    );
  }

  static add(v1, v2) {
    return {
      x: v1.x + v2.x,
      y: v1.y + v2.y,
      z: v1.z + v2.z,
    };
  }

  static sub(v1, v2) {
    return {
      x: v1.x - v2.x,
      y: v1.y - v2.y,
      z: v1.z - v2.z,
    };
  }

  static multiply(v1, v2) {
    return {
      x: v1.x * v2.x,
      y: v1.y * v2.y,
      z: v1.z * v2.z,
    };
  }

  static scale(v, scale) {
    return {
      x: v.x * scale,
      y: v.y * scale,
      z: v.z * scale,
    };
  }

  static dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  }

  static lenSq(v) {
    return Vec3.dot(v, v);
  }

  static len(v) {
    return Math.sqrt(Vec3.lenSq(v));
  }

  static normal(v) {
    const len = Vec3.len(v);
    if (len === 0) {
      return { x: 0, y: 0, z: 0 };
    }
    return Vec3.scale(v, 1 / len);
  }

  static cross(v1, v2) {
    return {
      x: v1.y * v2.z - v1.z * v2.y,
      y: v1.z * v2.x - v1.x * v2.z,
      z: v1.x * v2.y - v1.y * v2.x,
    };
  }

  static angleBetweenVectors(v1, v2) {
    const dp = Vec3.dot(v1, v2);
    const l1 = Vec3.len(v1);
    const l2 = Vec3.len(v2);
    return Math.acos(dp / (l1 * l2));
  }

  static surfaceNormal(v0, v1, v2) {
    const e1 = Vec3.sub(v1, v0);
    const e2 = Vec3.sub(v2, v0);
    // This order matters! This makes the normals face outward from the surfaces.
    const n = Vec3.cross(e2, e1);
    return Vec3.normal(n);
  }

  // Formula is: R = 2 * (N . L) * N - L, where 2 * (N . L) is the scalar for vector N.
  static getReflectionVector(n, v) {
    const twoDot = 2 * Vec3.dot(n, v);
    const scaledN = Vec3.scale(n, twoDot);
    return Vec3.sub(scaledN, v);
  }

  // This method shouldn't be used, but it illustrates how the cross product between two
  // vectors can be decomposed. If u x v = |u| * |v| * sin(theta) * n, where |u| * |v| * sin(theta)
  // is the scalar, then n can be found with n = normal(u x v). So, naturally, u x v already
  // contains the correct |u| * |v| * sin(theta) scalar. No need to recalculate it. See LaMothe
  // chapter 4 (p. 270).
  static _cross_decomposed(v1, v2) {
    const cross = Vec3.cross(v1, v2);
    const n = Vec3.normal(cross);
    const a = Vec3.angleBetweenVectors(v1, v2);
    const l1 = Vec3.len(v1);
    const l2 = Vec3.len(v2);
    return Vec3.scale(n, l1 * l2 * Math.sin(a)); // Should be equal to Vec3.cross(v1, v2) again
  }
}
