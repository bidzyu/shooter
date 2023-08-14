export class Controller {
  constructor(keyMap) {
    this.controllerFieldElem = document.createElement('div');
    this.controllerFieldElem.id = 'controller-field';
    this.keyMap = keyMap;

    this.controllerBtns = [];

    for (let i = 0; i < 4; i++) {
      const btn = document.createElement('div');
      btn.classList.add('controller-btn');
      let eventKey;

      switch (i) {
        case 0:
          eventKey = 'ArrowUp';
          break;
        case 1:
          eventKey = 'ArrowRight';
          break;
        case 2:
          eventKey = 'ArrowLeft';
          break;
        case 3:
          eventKey = 'ArrowDown';
          break;
      }

      btn.setAttribute('data-controller-key', eventKey);
      this.controllerFieldElem.append(btn);
    }

    this.btnsHandler = this.btnsHandler.bind(this);
  }

  getControllerElem() {
    return this.controllerFieldElem;
  }

  btnsHandler(event) {
    if (event.type !== 'pointerdown') return;

    let target = event.target;
    let targetKey = event.target.dataset.controllerKey;

    if (!targetKey) return;

    this.keyMap.set(targetKey, true);
    catchEvent = catchEvent.bind(this);
    document.body.addEventListener('pointerup', catchEvent);
    // target.addEventListener('pointerout', catchEvent);

    function catchEvent(event) {
      if (event.type !== 'pointerup') return;

      this.keyMap.delete(targetKey);
      document.body.removeEventListener('pointerup', catchEvent);
      // target.removeEventListener('pointerout', catchEvent);
    }
  }

  setController() {
    this.controllerFieldElem.addEventListener('pointerdown', this.btnsHandler);
  }

  removeController() {
    this.controllerFieldElem.removeEventListener(
      'pointerdown',
      this.btnsHandler
    );
  }
}
