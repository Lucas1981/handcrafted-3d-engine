import { LIGHT_TYPES } from "../constants";

export class DirectionalLight {
  constructor(intensity, color, direction) {
    this.type = LIGHT_TYPES.DIRECTIONAL;
    this.intensity = intensity;
    this.color = color;
    this.direction = direction;
  }
}
