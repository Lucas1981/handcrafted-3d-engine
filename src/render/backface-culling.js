import { Vec3, vertArrToObj } from "../math/Vec3";

export const applyBackfaceCulling = (plist, vlist) => {
  const tplist = plist.filter((polygon) => {
    const v0 = vertArrToObj(vlist[polygon.vertexIndices[0]]);
    const v1 = vertArrToObj(vlist[polygon.vertexIndices[1]]);
    const v2 = vertArrToObj(vlist[polygon.vertexIndices[2]]);
    const surfaceNormal = Vec3.surfaceNormal(v0, v1, v2);
    const dp = Vec3.dot(v0, surfaceNormal);
    return dp < 0;
  });

  return tplist;
};
