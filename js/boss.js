import { BossBullet } from './bossBullet.js';
import { Enemy } from './enemy.js';
import { cosBetweenTwoPoints, sinBetweenTwoPoints } from './utilities.js';

export class Boss extends Enemy {
  constructor(...args) {
    super(...args);

    this.canRedir = true;
    this.redirection = this.redirection.bind(this);
    this.bullets = [];

    this.img.src = `./img/boss-${1}.png`;

    this.redirection();
    this.startShoot();
  }

  redirection() {
    if (Math.random() > 0.8) {
      this.playerDirection = true;
    } else {
      this.playerDirection = false;
      this.point = this.getRandomPlace();
    }

    if (!this.dead) {
      let random = 400 + Math.random() * 600;

      setTimeout(() => {
        this.redirection();
      }, random);
    }
  }

  upgrade() {
    this.hasDrop = true;
    this.enemyMs *= 1.35;
    this.healthBase *= 2;
    this.health = this.healthBase;
    this.scoreBase *= 4;
    this.img.src = `./img/boss-${2}.png`;
  }

  directionCoordsUpdate() {
    if (this.playerDirection) {
      super.directionCoordsUpdate();
    } else {
      super.directionCoordsUpdate(this.point.x, this.point.y);
    }
  }

  getRandomPlace() {
    let x = Math.random() * this.winWidth;
    let y = Math.random() * this.winHeight;

    return {
      x: x,
      y: y,
    };
  }

  changeIcon() {
    this.img.src = `./img/boss-${this.superBoss ? 2 : 1}-dead.png`;
    this.stepsCount = 0;
  }

  update() {
    this.drawHp();
    super.update();
  }

  drawHp() {
    let oneHpSize = this.enemyWidth / this.healthBase;
    let hpCount = this.health * oneHpSize;

    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(
      this.x - this.enemyWidth / 2,
      this.y - this.enemyHeight / 2,
      hpCount,
      5
    );
    this.ctx.fill();
    this.ctx.closePath();
  }

  shoot() {
    let bullet = new BossBullet(
      this.x,
      this.y,
      this.player.x,
      this.player.y,
      this.ctx,
      this.winWidth,
      this.winHeight,
      this
    );
    bullet.boss = this;
    this.bullets.push(bullet);
  }

  startShoot() {
    this.isShoot = true;
    this.setShootTimer();
  }

  setShootTimer() {
    this.shoot();
    let random = 300 + Math.random() * (this.superBoss ? 700 : 1700);
    this.timer = setTimeout(() => this.setShootTimer(), random);
  }

  stopShoot() {
    this.isShoot = false;
    clearTimeout(this.timer);
  }
}
