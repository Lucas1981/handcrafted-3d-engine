import {
  WIDTH,
  HEIGHT,
  HALF_SCREEN_WIDTH,
  HALF_SCREEN_HEIGHT,
  W_EPS,
  APPLY_BACKFACE_CULLING,
  DRAW_LIGHT_SOURCES,
  DEBUG_DRAW_BIRDS_EYE_VIEW,
} from "../constants";
import { Mat4 } from "../math/Mat4";
import { isMeshVisible } from "./mesh-culling";
import { applyBackfaceCulling } from "./backface-culling";
import { calculateLighting } from "../light/calculate-lighting";
import { Graphics } from "./Graphics";
import { drawBirdsEyeView } from "./birds-eye-view.js";
import { clipAgainstNearPlane } from "./near-plane-clipping.js";

export class Renderer {
  constructor(canvas, projectionMatrix) {
    this.graphics = new Graphics(canvas);
    this.projectionMatrix = projectionMatrix;

    // Cache this for the optional birds-eye-view debug viewing
    this.clippedVertices = null;
    this.finalPolygons = null;
  }

  render(meshes, camera, lights, ambient = 0.3) {
    const view = camera.getCameraTransformMatrix();
    this.#clearScreen();
    this.graphics.resetZBuffer();
    this.#pipeline(view, meshes, lights, camera, ambient);
    this.graphics.putImageData();
    if (DRAW_LIGHT_SOURCES) {
      this.#drawLightSources(view, lights);
    }

    if (DEBUG_DRAW_BIRDS_EYE_VIEW) {
      drawBirdsEyeView(this.graphics, this.clippedVertices, this.finalPolygons);
    }
  }

  #pipeline(view, meshes, lights, camera, ambient) {
    for (const mesh of meshes) {
      const model = mesh.getModelMatrix();
      const mv = Mat4.multiply(model, view);
      // We need a point to transform to check against, so pick local origin 0,0,0,1
      const centerCam = Mat4.transformVec4([0, 0, 0, 1], mv);
      if (!isMeshVisible(centerCam, mesh.getMaxRadius())) {
        continue;
      }
      const tplist = this.#cullBackfaces(mv, mesh);
      const world = this.#transformVecList(model, mesh);
      const lighting = calculateLighting(
        world,
        tplist,
        lights,
        camera,
        ambient,
      );
      const mvp = Mat4.multiply(mv, this.projectionMatrix);
      const tvlist = this.#transformVecList(mvp, mesh);
      // This is where we need to apply the near-z clipping
      const { clippedVertices, clippedPolygons } = clipAgainstNearPlane(
        tvlist,
        tplist,
        lighting,
      );

      const projected = this.#getProjectedCoordinates(clippedVertices);
      const finalPolygons = this.#cullPolygons(projected, clippedPolygons);
      const screen = this.#getScreenCoordinates(projected, clippedVertices);
      this.graphics.drawTexturedGouraudShaded(screen, finalPolygons, lighting);

      if (DEBUG_DRAW_BIRDS_EYE_VIEW) {
        this.clippedVertices = clippedVertices;
        this.finalPolygons = finalPolygons;
      }
    }
  }

  #drawLightSources(view, lights) {
    for (const light of lights) {
      const pos = light.getPosition();
      const model = Mat4.translation(pos.x, pos.y, pos.z);
      const mv = Mat4.multiply(model, view);
      const mvp = Mat4.multiply(mv, this.projectionMatrix);
      const tvec = Mat4.transformVec4([0, 0, 0, 1], mvp);
      const projected = this.#getProjectedCoordinates([tvec]);
      const screen = this.#getScreenCoordinates(projected, [tvec]);
      this.graphics.drawLightSource(screen[0]);
    }
  }

  #cullPolygons(screen, tplist) {
    return tplist.filter((polygon) => {
      const verts = polygon.vertexIndices.map((idx) => screen[idx]);
      if (
        verts.every(({ x }) => x < -1) ||
        verts.every(({ y }) => y < -1) ||
        verts.every(({ x }) => x > 1) ||
        verts.every(({ y }) => y > 1)
      ) {
        return false;
      }

      return true;
    });
  }

  #cullBackfaces(mv, mesh) {
    if (APPLY_BACKFACE_CULLING) {
      const tvlist = this.#transformVecList(mv, mesh);
      const tplist = applyBackfaceCulling(mesh.plist, tvlist);
      return tplist;
    }
    return mesh.plist;
  }

  #transformVecList(transformer, mesh) {
    const tvlist = [];
    for (const vertex of mesh.vlist) {
      const vec = [...vertex, 1];
      tvlist.push(Mat4.transformVec4(vec, transformer));
    }
    return tvlist;
  }

  #getProjectedCoordinates(tvlist) {
    return tvlist.map((vertex) => {
      // Avoid division by zero or by extremely small number
      const safeW = this.#getSafeW(vertex[3]);
      return {
        x: vertex[0] / safeW, // x / w
        y: vertex[1] / safeW, // y / w
      };
    });
  }

  #getScreenCoordinates(projected, tvlist) {
    return projected.map((p, index) => ({
      x: Math.floor((p.x + 1) * HALF_SCREEN_WIDTH),
      y: Math.floor((-p.y + 1) * HALF_SCREEN_HEIGHT),
      // NOTE: Once we introduce near-plane clipping, we will have to recompute depth.
      depth: 1 / (tvlist[index][2] || W_EPS),
    }));
  }

  #getSafeW(w) {
    if (w === 0) {
      return W_EPS;
    }

    if (Math.abs(w) < W_EPS) {
      return w < 0 ? -W_EPS : W_EPS;
    }

    return w;
  }

  #clearScreen() {
    this.graphics.clearScreenWithImageData();
  }
}
