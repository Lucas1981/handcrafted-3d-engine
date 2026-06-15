import { LIGHT_TYPES } from "../constants";
import { Vec3 } from "../math/Vec3";
import { hexToDec } from "../render/shaders/utils";

const calculateDirectionalLightIntensity = (
  polygon,
  surfaceNormalList,
  light,
) => {
  const { surfaceNormal } = surfaceNormalList.find(
    ({ id }) => id === polygon.id,
  );
  const l = light.direction;
  const dp = Vec3.dot(surfaceNormal, l);
  return Math.max(dp, 0);
};

const clamp = (val) => Math.min(val, 255);

export const calculateLitColor = (hexColor, intensity) => {
  const color = hexToDec(hexColor);
  return [
    clamp(color[0] * intensity),
    clamp(color[1] * intensity),
    clamp(color[2] * intensity),
    color[3],
  ];
};

export const calculateLighting = (
  mesh,
  tplist,
  lights,
  surfaceNormalList,
  ambient = 0.2,
) => {
  const result = []; // This will be the resulting list of light intensities per vertex
  for (const polygon of tplist) {
    let intensity = ambient;
    for (const light of lights || []) {
      switch (light.type) {
        case LIGHT_TYPES.DIRECTIONAL:
          intensity += calculateDirectionalLightIntensity(
            polygon,
            surfaceNormalList,
            light,
          );
          break;
        default:
          throw new Error("Unknown light type");
      }
    }
    result.push({
      id: polygon.id,
      intensity,
    }); // Corresponds to the index in the tplist
  }

  return result;
};
