export class TextureMap {
  constructor() {
    this.map = {};
    this.keys = [];
    this.promises = [];
  }

  getPromises() {
    return this.promises;
  }

  loadTexture(fileName) {
    if (this.keys.includes(fileName)) {
      return Promise.resolve();
    }

    this.keys.push(fileName);

    const promise = new Promise((resolve) => {
      const image = new Image();
      image.src = fileName;
      image.onload = () => {
        // Transfer the image data onto an off-screen canvas
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, image.width, image.height);
        const imageData = ctx.getImageData(0, 0, image.width, image.height);
        this.map[fileName] = imageData;
        resolve();
      };
    });

    this.promises.push(promise);

    return promise;
  }

  getTexture(textureName) {
    return this.map[textureName];
  }
}
