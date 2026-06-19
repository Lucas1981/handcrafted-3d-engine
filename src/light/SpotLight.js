import { LIGHT_TYPES } from "../constants";
import { Vec3, vertArrToObj } from "../math/Vec3";

export class SpotLight {
  constructor(
    intensity,
    pos,
    dir,
    color = [255, 255, 255],
    kc = 1,
    kl = 1,
    kq = 1,
    powerFactor = 1,
  ) {
    this.type = LIGHT_TYPES.SPOT;
    this.intensity = intensity;
    this.pos = pos;
    this.dir = Vec3.normal(dir);
    this.color = color;
    this.kc = kc;
    this.kl = kl;
    this.kq = kq;
    this.powerFactor = powerFactor;
    this.normalizedColor = color.map((component) => component / 255);
  }

  getPosition() {
    return this.pos;
  }

  #getAttenuation(posArr) {
    const pos = vertArrToObj(posArr);
    const toSurface = Vec3.sub(pos, this.pos);
    const d = Vec3.len(toSurface);
    if (d === 0) {
      return 0;
    }

    const denom =
      this.kc + this.kl * d + (this.kq !== 0 ? this.kq * Math.pow(d, 2) : 0);

    const s = Vec3.normal(toSurface);
    const l = this.dir; // Alias to clarify the math in the next line
    const cone = Math.pow(Math.max(Vec3.dot(l, s), 0), this.powerFactor);
    return cone / denom;
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
