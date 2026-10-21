export class Inputs {
  constructor() {
    this.keymap = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      w: false,
      s: false,
    };

    document.addEventListener("keyup", this.handleKeyUp.bind(this));
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  handleKeyUp({ key }) {
    if (key in this.keymap) {
      this.keymap[key] = false;
    }
  }

  handleKeyDown({ key }) {
    if (key in this.keymap) {
      this.keymap[key] = true;
    }
  }

  getKeymap() {
    return this.keymap;
  }
}
