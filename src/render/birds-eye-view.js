const BOX_WIDTH = 200;
const BOX_HEIGHT = 200;
const BOX_COLOR = "#888888";
const SCALE = 20;

export const drawBirdsEyeView = (graphics, tvlist, finalPolygons) => {
  // Draw a small space in the top/left corner
  graphics.drawLine(0, 0, BOX_WIDTH, 0, BOX_COLOR);
  graphics.drawLine(0, 0, 0, BOX_HEIGHT, BOX_COLOR);
  graphics.drawLine(BOX_WIDTH, 0, BOX_WIDTH, BOX_HEIGHT, BOX_COLOR);
  graphics.drawLine(0, BOX_HEIGHT, BOX_WIDTH, BOX_HEIGHT, BOX_COLOR);

  // Draw the near-clipping line
  graphics.drawLine(0, BOX_HEIGHT / 4, BOX_WIDTH, BOX_HEIGHT / 4);

  // Iterate over all the polygons, and draw the lines scaled to the box, dropping the y axis
  for (const polygon of finalPolygons) {
    const vertices = [];

    for (const vertexIndex of polygon.vertexIndices) {
      const [x, y, z] = tvlist[vertexIndex];
      graphics.drawCircle(
        BOX_WIDTH / 2 + x * SCALE,
        BOX_HEIGHT / 4 + z * SCALE,
        2,
        "#ff0000",
      );
      vertices.push({ x, y: z });
    }

    for (let i = 0; i <= vertices.length; i++) {
      const from = vertices[i % vertices.length];
      const to = vertices[(i + 1) % vertices.length];
      graphics.drawLine(
        BOX_WIDTH / 2 + from.x * SCALE,
        BOX_HEIGHT / 4 + from.y * SCALE,
        BOX_WIDTH / 2 + to.x * SCALE,
        BOX_HEIGHT / 4 + to.y * SCALE,
        "#ff0000",
      );
    }
  }
};
