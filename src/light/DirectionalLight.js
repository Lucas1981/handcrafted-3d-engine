import { LIGHT_TYPES } from "../constants";
import { Vec3 } from "../math/Vec3";

export class DirectionalLight {
  constructor(intensity, color, direction) {
    this.type = LIGHT_TYPES.DIRECTIONAL;
    this.intensity = intensity;
    this.color = color;
    // Just to be safe, we store this as normal here if the consumer didn't normalize already
    this.direction = Vec3.normal(direction);
    this.normalizedColor = color.map((component) => component / 255);
  }

  getPosition() {
    return { x: 0, y: 0, z: 0 };
  }

  getIntensityRGB() {
    return [
      this.normalizedColor[0] * this.intensity,
      this.normalizedColor[1] * this.intensity,
      this.normalizedColor[2] * this.intensity,
    ];
  }

  getDirectionNormal() {
    return this.direction;
  }
}
