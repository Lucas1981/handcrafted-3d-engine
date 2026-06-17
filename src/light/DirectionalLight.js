import { LIGHT_TYPES } from "../constants";
import { Vec3 } from "../math/Vec3";

export class DirectionalLight {
  constructor(intensity, color, direction) {
    this.type = LIGHT_TYPES.DIRECTIONAL;
    this.intensity = intensity;
    this.color = color;
    // Just to be safe, we store this as normal here if the consumer didn't normalize already
    this.direction = Vec3.normal(direction);
  }

  getPosition() {
    return { x: 0, y: 0, z: 0 };
  }

  getIntensityRGB() {
    return [
      (this.color[0] / 255) * this.intensity,
      (this.color[1] / 255) * this.intensity,
      (this.color[2] / 255) * this.intensity,
    ];
  }

  getDirectionNormal() {
    return this.direction;
  }
}
