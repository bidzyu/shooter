import { cosBetweenTwoPoints, sinBetweenTwoPoints } from './utilities.js';

const MOVE_UP_KEY_CODES = ['ArrowUp', 'KeyW'];
const MOVE_DOWN_KEY_CODES = ['ArrowDown', 'KeyS'];
const MOVE_LEFT_KEY_CODES = ['ArrowLeft', 'KeyA'];
const MOVE_RIGHT_KEY_CODES = ['ArrowRight', 'KeyD'];
const ALL_MOVE_KEY_CODES = [
  ...MOVE_UP_KEY_CODES,
  ...MOVE_DOWN_KEY_CODES,
  ...MOVE_LEFT_KEY_CODES,
  ...MOVE_RIGHT_KEY_CODES,
];

export class Player {
  constructor(
    x,
    y,
    ctx,
    canvasWidth,
    canvasHeight,
    health,
    healthElem,
    ammo,
    ammoLimit,
    ammoElem,
    clicker
  ) {
    this.x = x;
    this.y = y;
    this.ctx = ctx;
    this.health = health;
    this.healthElem = healthElem;
    this.ammo = ammo;
    this.ammoLimit = ammoLimit;
    this.ammoElem = ammoElem;
    this.clicker = clicker;

    this.cWidth = canvasWidth;
    this.cHeight = canvasHeight;

    this.width = 60;
    this.height = 60;
    this.radius = 20;
    this.playerMS = 4.5;
    this.img = new Image();
    this.img.src = './img/player-1.png';

    this.changeFrameValue = 12;
    this.stepsCountStart = 0;
    this.stepsCount = this.stepsCountStart;
    this.frameLimit = this.changeFrameValue * 2;

    this.hitted = false;

    this.keyMap = new Map();

    this.target = {
      x: x,
      y: y,
    };

    document.addEventListener('keydown', (event) => {
      this.keyMap.set(event.code, true);
    });

    document.addEventListener('keyup', (event) => {
      this.keyMap.delete(event.code);
    });

    document.addEventListener('mousemove', (event) => {
      this.lastX = event.clientX;
      this.lastY = event.clientY;
    });
  }

  getKeyMap() {
    return this.keyMap;
  }

  draw() {
    this.ctx.save();

    let angle = Math.atan2(this.lastY - this.y, this.lastX - this.x);
    this.ctx.translate(this.x, this.y);
    this.ctx.rotate(angle + Math.PI / 2);
    this.ctx.translate(-this.x, -this.y);
    this.drawPlayer();
    this.ctx.restore();
  }

  drawPlayer() {
    if (this.stepsCount > this.frameLimit) {
      this.stepsCount = this.stepsCountStart;
    }

    if (this.isStaying()) {
      this.stepsCount = this.changeFrameValue * 2;
    }

    let currentFrame = Math.floor(this.stepsCount / this.changeFrameValue);
    let currValue = {};

    switch (currentFrame) {
      case 0:
        currValue.v = 10;
        currValue.w = 45;
        break;

      case 1:
        currValue.v = 50;
        currValue.w = 45;
        break;

      case 2:
        currValue.v = 92;
        currValue.w = 45;
        break;
    }

    this.ctx.drawImage(
      this.img,
      currValue.v,
      0,
      currValue.w,
      this.height - 10,
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    this.stepsCount++;
  }

  movePlayer() {
    if (this.shouldMove(MOVE_UP_KEY_CODES)) {
      this.y -= this.playerMS;
    }
    if (this.shouldMove(MOVE_DOWN_KEY_CODES)) {
      this.y += this.playerMS;
    }
    if (this.shouldMove(MOVE_LEFT_KEY_CODES)) {
      this.x -= this.playerMS;
    }
    if (this.shouldMove(MOVE_RIGHT_KEY_CODES)) {
      this.x += this.playerMS;
    }
  }

  isStaying() {
    return !this.shouldMove(ALL_MOVE_KEY_CODES);
  }

  shouldMove(keyList) {
    return keyList.some((key) => this.keyMap.get(key));
  }

  checkPositionLimitAndUpdate() {
    if (this.y < this.radius) this.y = this.radius;
    if (this.y > this.cHeight - this.radius)
      this.y = this.cHeight - this.radius;
    if (this.x < this.radius) this.x = this.radius;
    if (this.x > this.cWidth - this.radius) this.x = this.cWidth - this.radius;
  }

  update() {
    this.draw();
    this.movePlayer();
    this.checkPositionLimitAndUpdate();
  }

  decreaseHealth(value) {
    this.health -= value || 5;

    if (!this.hitted) {
      this.hitted = true;
      this.img.src = './img/player-2.png';
      setTimeout(() => {
        this.hitted = false;
        this.img.src = './img/player-1.png';
      }, 500);
    }
    return this.health;
  }

  increaseHealth(value) {
    let newHealth = this.health + value;
    newHealth = newHealth > 100 ? 100 : newHealth;
    this.health = newHealth;
    this.healthElem.innerHTML = newHealth;
  }

  decreaseAmmo() {
    if (this.ammo === Infinity) return;

    this.ammo--;
    this.ammoElem.innerHTML = this.ammo;
  }

  increaseAmmo(value) {
    if (this.ammo === Infinity) {
      this.savedAmmo += value;
      this.savedAmmo =
        this.savedAmmo > this.ammoLimit ? this.ammoLimit : this.savedAmmo;
      return;
    }

    let newAmmo = (this.ammo += value);
    newAmmo = newAmmo > this.ammoLimit ? this.ammoLimit : newAmmo;
    this.ammo = newAmmo;
    this.ammoElem.innerHTML = newAmmo;
  }

  isAlive() {
    return this.health > 0;
  }

  setInfiniteAmmo() {
    this.savedAmmo = this.ammo;
    this.ammo = Infinity;
    this.ammoElem.innerHTML = '∞';
  }

  setFiniteAmmo() {
    this.ammo = this.savedAmmo;
    this.savedAmmo = null;
    this.ammoElem.innerHTML = this.ammo;
  }
}
