import { LIGHT_TYPES } from "../constants";
import { Vec3, vertArrToObj } from "../math/Vec3";

const clamp = (val) => Math.max(Math.min(val, 255), 0);
const clamped = (color) => [clamp(color[0]), clamp(color[1]), clamp(color[2])];

const addColors = (c1, c2) => [c1[0] + c2[0], c1[1] + c2[1], c1[2] + c2[2]];
const multiplyColors = (c1, c2) => [
  c1[0] * c2[0],
  c1[1] * c2[1],
  c1[2] * c2[2],
];
const scaleColor = (c, scalar) => [c[0] * scalar, c[1] * scalar, c[2] * scalar];

const getSurfaceNormal = (polygon, vlist) => {
  const v0 = vertArrToObj(vlist[polygon.vertexIndices[0]]);
  const v1 = vertArrToObj(vlist[polygon.vertexIndices[1]]);
  const v2 = vertArrToObj(vlist[polygon.vertexIndices[2]]);
  return Vec3.surfaceNormal(v0, v1, v2);
};

// So this will be the sequence:
// 1. We go over each polygon
//   2. For each of the vertices in that polygon, we go over it (so we will treat each vertex many times)
//     3. We apply ambient lighting only once, right away
//     4. For each of the lights we have, we go over it and calculate first their intensityRGB
//     We do this by just applying `const intensityRGB = lightSource.getIntensityRGB(vertex)`
//       5. We will also have to get the direction of the lightSource.
//       6. Then we calculate the effect for each of those intensities on each material type
//       7. We add up all the intensities per material type
// 8. We store the final color in an array associated with this polygon, clamped to 255 per channel.
export const calculateLighting = (
  tvlist,
  tplist,
  lights,
  camera,
  ambientScalar = 0.2,
) => {
  const lit = {};
  for (const polygon of tplist) {
    const surfaceNormal = getSurfaceNormal(polygon, tvlist);
    lit[polygon.id] = [];
    const vertices = polygon.vertexIndices.map(
      (vertexIndex) => tvlist[vertexIndex],
    );

    for (const vertex of vertices) {
      if (polygon?.materials?.emissive) {
        const { emissive } = polygon.materials;
        lit[polygon.id].push(emissive);
        continue;
      }

      let finalColor = [0, 0, 0];
      if (polygon?.materials?.ambient) {
        const ambient = polygon.materials.ambient;
        const intensityAmbient = clamped(scaleColor(ambient, ambientScalar));
        finalColor = addColors(finalColor, intensityAmbient);
      }

      for (const light of lights) {
        const intensityRGB = light.getIntensityRGB(vertex);
        const directionNormal = light.getDirectionNormal(vertex);
        const directionSurfaceDot = Vec3.dot(directionNormal, surfaceNormal);

        if (polygon?.materials?.diffuse) {
          const { diffuse } = polygon.materials;
          const dot = Math.max(directionSurfaceDot, 0);
          let intensityDiffuse = multiplyColors(diffuse, intensityRGB);
          intensityDiffuse = scaleColor(intensityDiffuse, dot);
          finalColor = addColors(finalColor, intensityDiffuse);
        }

        if (polygon?.materials?.specular) {
          // See LaMothe, p. 754-755
          const { specular } = polygon.material;
          const reflectionVectorNormal = Vec3.getReflectionVector(
            surfaceNormal,
            directionNormal,
          );
          const cameraPos = camera.getPos();
          const viewVectorNormal = Vec3.normal(Vec3.sub(cameraPos, vertex));
          const dot = Math.max(
            Vec3.dot(reflectionVectorNormal, viewVectorNormal),
            0,
          );
          const factor = Math.pow(dot, polygon.specularPower);
          let intensitySpecular = multiplyColors(specular, intensityRGB);
          intensitySpecular = scaleColor(intensitySpecular, factor);
          intensitySpecular = scaleColor(
            intensitySpecular,
            directionSurfaceDot > 0 ? 1 : 0,
          );
          finalColor = addColors(finalColor, intensitySpecular);
        }
      }

      lit[polygon.id].push(clamped(finalColor));
    }
  }

  return lit;
};
