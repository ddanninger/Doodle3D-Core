import * as THREE from 'three';

export default class RenderPass {
  constructor(scene, camera, callbackBeforeRender) {
    this.scene = scene;
    this.camera = camera;
    this._callbackBeforeRender = callbackBeforeRender;

    this.clear = true;
    this.renderToScreen = false;
  }

  setSize(width, height) {
  }

  render(renderer, writeBuffer, readBuffer, delta, maskActive) {
    if (this._callbackBeforeRender) this._callbackBeforeRender();

    let oldAutoClear;
    if (this.clear === false) {
      oldAutoClear = renderer.autoClear;
      renderer.autoClear = false;
    }

    renderer.render(this.scene, this.camera, this.renderToScreen ? null : readBuffer, this.clear);

    if (this.clear === false) {
      renderer.autoClear = oldAutoClear;
    }
  }
}
