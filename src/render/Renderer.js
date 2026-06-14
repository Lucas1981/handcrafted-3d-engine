import {
  WIDTH,
  HEIGHT,
  HALF_SCREEN_WIDTH,
  HALF_SCREEN_HEIGHT,
  W_EPS,
  APPLY_BACKFACE_CULLING,
} from "../constants";
import { Mat4 } from "../math/Mat4";
import { isMeshVisible } from "./mesh-culling";
import { applyBackfaceCulling } from "./backface-culling";
import { drawTriangleFlatShade } from "./shaders/flat-shader";

export class Renderer {
  constructor(canvas, projectionMatrix) {
    this.ctx = canvas.getContext("2d");
    this.imageData = this.ctx.getImageData(0, 0, WIDTH, HEIGHT);
    this.projectionMatrix = projectionMatrix;
  }

  render(meshes, camera) {
    this.#clearScreen();
    const view = camera.getCameraTransformMatrix();
    this.#pipeline(view, meshes);
    this.ctx.putImageData(this.imageData, 0, 0);
  }

  #pipeline(view, meshes) {
    for (const mesh of meshes) {
      const model = mesh.getModelMatrix();
      const mv = Mat4.multiply(model, view);
      // We need a point to transform to check against, so pick local origin 0,0,0,1
      const centerCam = Mat4.transformVec4([0, 0, 0, 1], mv);
      if (!isMeshVisible(centerCam, mesh.getMaxRadius())) {
        continue;
      }
      const tplist = this.#getBackfaceCulledPolygons(mv, mesh);
      const mvp = Mat4.multiply(mv, this.projectionMatrix);
      const tvlist = this.#transformVecList(mvp, mesh);
      const projected = this.#getProjectedCoordinates(tvlist);
      const screen = this.#getScreenCoordinates(projected);
      this.#drawFlatShaded(screen, tplist);
    }
  }

  #getBackfaceCulledPolygons(mv, mesh) {
    let tplist = mesh.plist;
    if (APPLY_BACKFACE_CULLING) {
      const tvlist = this.#transformVecList(mv, mesh);
      tplist = applyBackfaceCulling(mesh.plist, tvlist);
    }
    return tplist;
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

  #getScreenCoordinates(projected) {
    return projected.map((p) => ({
      x: (p.x + 1) * HALF_SCREEN_WIDTH,
      y: (-p.y + 1) * HALF_SCREEN_HEIGHT,
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
    this.#clearScreenWithImageData();
  }

  #clearScreenWithImageData() {
    for (let i = 0; i < WIDTH * HEIGHT * 4; i += 4) {
      this.imageData.data[i] = 0;
      this.imageData.data[i + 1] = 0;
      this.imageData.data[i + 2] = 0;
      this.imageData.data[i + 3] = 255;
    }
  }

  #clearScreenWithContextCommands() {
    this.ctx.beginPath();
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
    this.ctx.fill();
  }

  // With the current solid modeling setup, this method wouldn't work anymore.
  // you'd have to remove the this.ctx.putImageData(this.imageData, 0, 0) statement
  // in the render method. You'd also have to switch to #clearScreenWithContextCommands
  // in the #clearScreen method.
  #drawWireframe(screen, polygons) {
    for (const polygon of polygons) {
      this.ctx.beginPath();
      const p1 = screen[polygon.vertexIndices[0]];
      const p2 = screen[polygon.vertexIndices[1]];
      const p3 = screen[polygon.vertexIndices[2]];
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.lineTo(p2.x, p2.y);
      this.ctx.lineTo(p3.x, p3.y);
      this.ctx.lineTo(p1.x, p1.y);
      this.ctx.strokeStyle = polygon.color;
      this.ctx.stroke();
    }
  }

  #drawFlatShaded(screen, polygons) {
    for (const polygon of polygons) {
      drawTriangleFlatShade(polygon, screen, this.imageData);
    }
  }
}
