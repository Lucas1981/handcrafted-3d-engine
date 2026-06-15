import { Vec3 } from "../math/Vec3";

const vertArrToObj = (arr) => {
  const [x, y, z] = arr;
  return { x, y, z };
};

export const applyBackfaceCulling = (plist, vlist) => {
  const surfaceNormalList = [];
  const tplist = plist.filter((polygon) => {
    const v0 = vertArrToObj(vlist[polygon.vertexIndices[0]]);
    const v1 = vertArrToObj(vlist[polygon.vertexIndices[1]]);
    const v2 = vertArrToObj(vlist[polygon.vertexIndices[2]]);
    const e1 = Vec3.sub(v1, v0);
    const e2 = Vec3.sub(v2, v0);
    const n = Vec3.cross(e1, e2);
    surfaceNormalList.push({
      id: polygon.id,
      surfaceNormal: Vec3.normal(n),
    });
    const dp = Vec3.dot(v0, n);
    return dp >= 0;
  });

  return { tplist, surfaceNormalList };
};
