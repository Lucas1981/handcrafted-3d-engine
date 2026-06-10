import { degToRad } from "../math/trig";
import { Vec3 } from "../math/Vec3";
import { Mat4 } from "../math/Mat4";

export class Camera {
  constructor(pos = { x: 0, y: 0, z: 0 }, elevation = 90, heading = 270) {
    this.pos = pos;
    this.rho = 1;
    this.heading = heading; // theta
    this.elevation = elevation; // phi
  }

  getPos() {
    return this.pos;
  }

  setPos(pos) {
    this.pos = pos;
  }

  getHeading() {
    return this.heading;
  }

  setHeading(heading) {
    this.heading = heading;
  }

  increaseHeading(increment) {
    this.heading += increment;
  }

  getElevation() {
    return this.elevation;
  }

  increaseElevation(increment) {
    this.elevation += increment;
  }

  setElevation(elevation) {
    this.elevation = elevation;
  }

  getCameraTransformMatrix() {
    const target = this.getTarget();
    return Mat4.camera(target, this.pos);
  }

  // Method to get the point right in front of us, see LaMothe p. 666-667
  getTarget() {
    const heading = degToRad * this.heading;
    const elevation = degToRad * this.elevation;
    const r = this.rho * Math.sin(elevation); // r = rho * sin(phi)
    const z = -r * Math.sin(heading); // z becomes x = -r * sin(theta)
    const x = -1 * this.rho * Math.cos(elevation); // x becomes -y = -1 * rho * cos(phi)
    const y = r * Math.cos(heading); // y becomes z = r * cos(theta)
    return Vec3.add(this.pos, { x, y, z });
  }
}
