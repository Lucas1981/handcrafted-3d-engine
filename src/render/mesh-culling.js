import {
  NEAR,
  FAR,
  VIEWPLANE_WIDTH,
  VIEW_DIST,
  VIEWPLANE_HEIGHT,
} from "../constants";

// Heavily based on LaMothe, p. 686-687
export const isMeshVisible = ([x, y, z], maxRadius) => {
  if (z - maxRadius > FAR || z + maxRadius < NEAR) {
    return false;
  }

  const zTestForX = (0.5 * VIEWPLANE_WIDTH * z) / VIEW_DIST;
  if (x - maxRadius > zTestForX || x + maxRadius < -zTestForX) {
    return false;
  }

  const zTestForY = (0.5 * VIEWPLANE_HEIGHT * z) / VIEW_DIST;
  if (y - maxRadius > zTestForY || y + maxRadius < -zTestForY) {
    return false;
  }

  return true;
};
