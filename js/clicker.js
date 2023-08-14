export class Clicker {
  constructor(callback, ms = 50, ammoAutoElem, canvas) {
    this.callback = callback;
    this.ms = ms;
    this.canClick = true;
    this.canvas = canvas;

    this.mouseTimerId = null;

    this.auto = false;
    this.autoTime = 0;
    this.autoTimeLimit = 59;
    this.timerTickMs = 1000;
    this.ammoAutoElem = ammoAutoElem;
    this.canAddNow = true;
    this.additionalValue = 0;

    this.setClicker = this.setClicker.bind(this);
    this.removeClicker = this.removeClicker.bind(this);
    this.setCurrCoordsAndCallback = this.setCurrCoordsAndCallback.bind(this);
    this.updMouseCoords = this.updMouseCoords.bind(this);
    this.addAuto = this.addAuto.bind(this);
    this.removeAuto = this.removeAuto.bind(this);
    this.addSingle = this.addSingle.bind(this);
    this.removeSingle = this.removeSingle.bind(this);
    this.setAuto = this.setAuto.bind(this);
    this.setAutoNow = this.setAutoNow.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
  }

  start() {
    this.addSingle();
    this.ammoAutoElem.innerHTML = '';
    this.canvas.addEventListener('mousemove', this.updMouseCoords);
    // document.addEventListener('mousedown', this.changeGlobalMouseStatus);
    // document.addEventListener('mouseup', this.changeGlobalMouseStatus);
  }

  stop() {
    clearTimeout(this.autorepeatTimerId);
    clearTimeout(this.timerId);
    this.removeAuto();
    this.removeSingle();
    this.canvas.removeEventListener('mousemove', this.updMouseCoords);
    // document.removeEventListener('mousedown', this.changeGlobalMouseStatus);
    // document.removeEventListener('mouseup', this.changeGlobalMouseStatus);
  }

  setAutoNow(s, player) {
    if (!this.player) {
      this.player = player;
    }

    if (this.autorepeat) {
      this.additionalValue += s;
      return;
    }

    if (this.canAddNow) {
      this.setAuto((s += this.additionalValue));
      this.additionalValue = 0;
    } else {
      this.autorepeat = true;
      this.autorepeatTimerId = setTimeout(() => {
        this.autorepeat = false;
        this.autorepeatTimerId = null;
        this.setAutoNow(s);
      }, 1000);
    }
  }

  setAuto(s) {
    let currDate = Date.now();
    let timer = 0;
    let diff;

    if (this.auto) {
      clearTimeout(this.timerId);
      this.timerId = null;
      diff = currDate - this.lastDate;
      timer = diff > this.timerTickMs ? timer : this.timerTickMs - diff;
    } else {
      this.auto = true;
      this.player.setInfiniteAmmo();
      this.removeSingle();
      this.addAuto();
      if (!this.autoSetted) {
        this.autoSetted = true;
        this.setClicker();
      }
    }

    this.autoTime =
      this.autoTime + s > this.autoTimeLimit
        ? this.autoTimeLimit
        : this.autoTime + s;
    this.canAddNow = false;
    setTimeout(() => {
      this.canAddNow = true;
      this.startTimer();
    }, timer);
  }

  startTimer() {
    this.autoTime--;

    if (this.autoTime >= 0) {
      this.lastDate = Date.now();
      this.ammoAutoElem.innerHTML = `Auto: ${this.autoTime + 1}s`;
      this.timerId = setTimeout(() => this.startTimer(), this.timerTickMs);
    } else {
      this.ammoAutoElem.innerHTML = '';
      this.auto = false;
      this.player.setFiniteAmmo();
      this.removeAuto();
      this.addSingle();
      this.removeClicker();
      this.autoSetted = false;
    }
  }

  setClicker() {
    this.mouseTimerId = setInterval(() => {
      this.canvas.dispatchEvent(
        new Event('click', { bubbles: true, composed: true })
      );
    }, this.ms);
  }

  removeClicker() {
    clearInterval(this.mouseTimerId);
    this.mouseTimerId = null;
  }

  setCurrCoordsAndCallback(event) {
    let newX, newY;

    if (event.isTrusted) {
      newX = event.clientX;
      newY = event.clientY;
    } else {
      newX = this.lastMouseCoordsX;
      newY = this.lastMouseCoordsY;
    }

    if (this.canClick) {
      this.canClick = false;
      setTimeout(() => (this.canClick = true), this.ms - 1);
      this.callback(null, { x: newX, y: newY });
    }
  }

  updMouseCoords(event) {
    this.lastMouseCoordsX = event.clientX;
    this.lastMouseCoordsY = event.clientY;
  }

  addAuto() {
    this.canvas.addEventListener('click', this.setCurrCoordsAndCallback);
  }

  removeAuto() {
    this.canvas.removeEventListener('click', this.setCurrCoordsAndCallback);
  }

  addSingle() {
    this.canvas.addEventListener('mousedown', this.callback);
  }

  removeSingle() {
    this.canvas.removeEventListener('mousedown', this.callback);
  }
}
