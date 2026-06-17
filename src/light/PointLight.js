import { LIGHT_TYPES } from "../constants";
import { Vec3, vertArrToObj } from "../math/Vec3";

export class PointLight {
  constructor(intensity, pos, color = [255, 255, 255], kc = 1, kl = 1, kq = 1) {
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

  getIntensityRGB(posArr) {
    const pos = vertArrToObj(posArr);
    const d = Vec3.len(Vec3.sub(pos, this.pos));
    const denom =
      this.kc + this.kl * d + (this.kq !== 0 ? this.kq * Math.pow(d, 2) : 0);

    const intensity = d / denom;

    return [
      this.normalizedColor[0] * intensity * this.intensity,
      this.normalizedColor[1] * intensity * this.intensity,
      this.normalizedColor[2] * intensity * this.intensity,
    ];
  }

  getDirectionNormal(posArr) {
    const pos = vertArrToObj(posArr);
    const direction = Vec3.normal(Vec3.sub(pos, this.pos));
    return direction;
  }
}
