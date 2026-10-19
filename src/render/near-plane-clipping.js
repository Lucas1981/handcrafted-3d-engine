const Z_INDEX = 2;

const intersect = (a, b) => {
  const t = a[Z_INDEX] / (a[Z_INDEX] - b[Z_INDEX]);
  const result = a.map((value, index) => value + t * (b[index] - value));
  result[Z_INDEX] = 0;
  return result;
};

const clipPolygon = (vertices) => {
  const result = [];

  for (let i = 0; i < vertices.length; i++) {
    const current = vertices[i];
    const next = vertices[(i + 1) % vertices.length];

    const isCurrentInside = current[Z_INDEX] > 0;
    const isNextInside = next[Z_INDEX] > 0;

    if (isCurrentInside) {
      result.push(current);
      if (!isNextInside) {
        result.push(intersect(current, next));
      }
    } else if (isNextInside) {
      result.push(intersect(current, next));
    }
  }

  return result;
};

export const clipAgainstNearPlane = (tvlist, tplist, lighting) => {
  const finalVertices = [];
  const finalPolygons = [];

  for (const polygon of tplist) {
    const lit = lighting[polygon.id]; // id still matches here, but won't as soon as we clone
    const vertices = polygon.vertexIndices.map((i, index) => [
      ...tvlist[i],
      // Include the U and V coordinates for each of the vertices
      ...polygon.uvs[index],
      // Include the calculated r, g, b lighting values
      ...lit[index],
    ]);
    const anyOutside = vertices.some((vertex) => vertex[Z_INDEX] <= 0); // check on z-index

    if (!anyOutside) {
      const base = finalVertices.length;
      finalVertices.push(...vertices);
      // We assume all polygons are triangles here, so we don't iterate over the vertices
      // to turn an n-gon into a series of triangles.
      const clone = polygon.getClone(); // We have to keep original polygons in tact, so we clone
      clone.setVertexIndices([base, base + 1, base + 2]);
      clone.setLighting(lit);
      finalPolygons.push(clone);
      continue;
    }

    // In case we do have vertices outside

    const clipped = clipPolygon(vertices);
    // If we don't have at least 3 points to work with, discard this polygon
    if (clipped.length < 3) {
      continue;
    }

    // Otherwise, we have to iterate over the results and create new polygons for each set of 3
    const base = finalVertices.length;

    // Split out the vertices, UV coordinates and lighting
    const clippedVertices = clipped.map((arr) => arr.slice(0, 4));
    const clippedUvs = clipped.map((arr) => arr.slice(4, 6));
    const clippedLighting = clipped.map((arr) => arr.slice(6, 9));
    finalVertices.push(...clippedVertices);

    for (let i = 1; i < clipped.length - 1; i++) {
      // We'll have to clone the original polygon
      const clone = polygon.getClone();
      // And set the new vertex indices
      clone.setVertexIndices([base, base + i, base + i + 1]);
      clone.setUvs([clippedUvs[0], clippedUvs[i], clippedUvs[i + 1]]);
      // Index matching won't work beyond this point, so we'll have to set the lighting on the poly
      clone.setLighting([
        clippedLighting[0],
        clippedLighting[i],
        clippedLighting[i + 1],
      ]);
      finalPolygons.push(clone);
    }
  }

  return {
    clippedVertices: finalVertices,
    clippedPolygons: finalPolygons,
    clippedLighting: lighting,
  };
};
