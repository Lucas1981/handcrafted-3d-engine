import { LIGHT_TYPES } from "../constants";
import { Vec3, vertArrToObj } from "../math/Vec3";

export class PointLight {
  constructor(
    intensity,
    pos,
    color = [255, 255, 255],
    kc = 1,
    kl = 0.5,
    kq = 0.2,
  ) {
    this.type = LIGHT_TYPES.POINT;
    this.intensity = intensity;
    this.pos = pos;
    this.color = color;
    this.normalizedColor = color.map((component) => component / 255);
    this.kc = kc;
    this.kl = kl;
    this.kq = kq;
  }

  getPosition() {
    return this.pos;
  }

  #getAttenuation(posArr) {
    const pos = vertArrToObj(posArr);
    const d = Vec3.len(Vec3.sub(this.pos, pos));
    if (d === 0) {
      return 0;
    }

    const denom =
      this.kc + this.kl * d + (this.kq !== 0 ? this.kq * Math.pow(d, 2) : 0);

    return 1 / denom;
  }

  getIntensityRGB(posArr) {
    const k = this.#getAttenuation(posArr);
    if (k === 0) {
      return [0, 0, 0];
    }

    return [
      this.normalizedColor[0] * this.intensity * k,
      this.normalizedColor[1] * this.intensity * k,
      this.normalizedColor[2] * this.intensity * k,
    ];
  }

  getDirectionNormal(posArr) {
    const pos = vertArrToObj(posArr);
    const direction = Vec3.normal(Vec3.sub(this.pos, pos));
    return direction;
  }
}
