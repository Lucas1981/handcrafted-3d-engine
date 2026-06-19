# Handcrafted 3D engine

## Why do this?

So, I managed to get a 3D engine to pretty much work, having Frankensteined it together with old bits of code that I wrote in the before-AI era and using Cursor to stitch it all together and pad the missing parts, all the while reading my old André LaMothe bible on the subject. That's all well and good, but it felt like finishing a tough and worthwhile video game by using cheat codes. It doesn't really feel like an earned achievement.

So, that is why I want to create this repo. It might take me months, years, decades, I don't really care. I want to see if I can create a (better) 3D engine than the one I ended up with just creating it by hand. Even with the one I Frankenstein-vibecoded together, I felt alienation from the subject at many a turn where it turned into "yeah sure, just make it work already" kind of moments, glass-eyeing over code that felt unfamiliar but got the job done. I'm also 100% sure there is a whole bunch of code bloat in that repo.

That being said, frankenvibecoding it all together did help a lot. If you don't understand this subject matter at least to some degree it is also hard to prompt it all together - I tried before and failed, but ultimately got all the moving pieces in. It also made it possible to study a structure of how you might do things and better understand how pieces of the pipeline can hang together. So I do want to draw some learnings from the ultimate product, but not in a copy/paste way. I want to just write the whole damn thing myself to experience that sense of achievement you get after building something, which in the current state of the AI era (mid 2026) is lost.

## The plan

So, I fired up an instance of VSCode and not Cursor so I won't be tempted to throw all my requests and questions at Claude or any other of the LLM oracles. I'll want to do everything myself, understanding or at least going through every line of code. Having gone through the process once, I also have a good idea of how I want to build it. So Here's a list of steps that I want to take in an order that makes sense for me:

### Part I: Preparation

- [x] Scaffold the project: put up a Vite-based system that will dev serve the project with hot reloading, can build the project ready for deployment and have index.html and index.js files that show a simple "Hello, World!"
- [x] Add an HTML5 Canvas element to the project, set up a loop with requestNextAnimationFrame, and draw a triangle onto the canvas. We can use the moveTo/lineTo setup to draw wireframes at first, not having to deal with rasterization just yet.
- [x] Set up data structures to represent meshes and polygons in the scene we are going to set up.
- [x] Build the vec3 file with functions with which to manipulate 3D vectors, like addition, subtraction, scaling, multiplication, dot product and cross product.
- [x] Build the Matrix 4x4 file with the functions we will need to transform vec4 structures. It should have the functions to generate identity, translate, scale and rotate (in all 3 directions) matrices as well as a general multiply and a transformVec4 function that can apply all these matrices to our vertices in the end. We'll also add a function for the projection itself.
- [x] Add generators with which we can create object assets like cubes, pyramids, cylinders, spheres and toruses.

### Part II: Wireframe phase

- [x] Set up an MVP pipeline with which we can get the right 2D coordinates for all our meshes in the scene and draw them as wireframes on the screen. Use an identity matrix as a substitute for our camera transform at first, implying the camera is at 0,0,0 and looking right down at the scene, so with direction 0,0,1 if we choose to go with +z to denote distance from the viewing point.
- [x] Add a camera system with which we can move and rotate our viewpoint around. We will go with a UVN system.
- [x] Apply mesh culling by seeing which meshes completely fall outside of the viewing frustum.
- [x] Apply backface culling to the staged meshes

### Part III: Solid object phase

- [x] Replace the vector-based drawing with rasterized drawing, turning all meshes into solid objects. We will write triangle shaders to accomplish this with, that will write straight into the graphical memory. These will be simple flat shaders.
- [x] Introduce directional and ambient lighting. Apply the lighting to the flat shaders.
- [x] Add polygon culling, skipping drawing all polygons that fall outside the boundaries of the projection space after being transformed to 2D coordinates.
- [x] Add screen-based clipping to the rasterizer, adjusting the start and end positions based on the start and end points specified by the surviving polygons that have points that fall outside of the screen size.
- [x] Add z-buffer support for the rasterizers, incorporating support for 1/z interpolation for the z-buffer.

### Part IV: Gouraud and texturing phase

- [x] Add point lights to the light sources
- [x] Create a new Gouraud shader next to the flat shader that extends this principle and adds interpolation for the light intensity between the points of the triangle.
- [x] Add support for spotlights (+ bug fixes)
- [ ] Add a Gouraud/texture shader that extends the Gouraud shader by being able to interpolate over the coordinates of a texture to map pixels onto our polygons with added UV coordinates.
- [ ] Add a near-plane clipper.
- [ ] Add support for specular light.

### Bonus

- [ ] Apply perspective-correct interpolation to lighting.
- [ ] Switch from Gouraud to Phong shading, interpolating the surface normals rather than the light intensity, calculating the light intensity per-pixel. Would also mean the surface normals would have to be calculated taking into account their adjacent polygon neighbors.
- [ ] Try a baked-in scene where the light values are already pre-calculated using a light map.
