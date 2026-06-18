import { degToRad } from "./math/trig";

export const WIDTH = 1280;
export const HEIGHT = 720;
export const HALF_SCREEN_WIDTH = WIDTH / 2;
export const HALF_SCREEN_HEIGHT = HEIGHT / 2;
export const ASPECT_RATIO = WIDTH / HEIGHT;
export const FOV = 90;
export const TAN_FOV_DIV2 = Math.tan((FOV / 2) * degToRad);
export const VIEWPLANE_WIDTH = 2;
export const VIEWPLANE_HEIGHT = 2 / ASPECT_RATIO;
export const VIEW_DIST = (0.5 * VIEWPLANE_WIDTH) / TAN_FOV_DIV2; // essentially 1 / tan(FOV / 2)
export const W_EPS = 1e-8;
export const NEAR = 0.1;
export const FAR = 1000;
export const APPLY_BACKFACE_CULLING = true;
export const DRAW_LIGHT_SOURCES = false;
export const LIGHT_TYPES = {
  DIRECTIONAL: "directional",
  POINT: "point",
  SPOT: "spot",
};
