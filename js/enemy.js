import { cosBetweenTwoPoints, sinBetweenTwoPoints } from './utilities.js';
import { Improvement } from './improvements/improvements.js';

export class Enemy {
  constructor(
    ctx,
    player,
    winWidth,
    winHeight,
    speed,
    scoreBase = 10,
    isBoss = false,
    health
  ) {
    this.ctx = ctx;
    this.player = player;
    this.enemyType = Math.random() > 0.85 ? 2 : 1;
    this.enemyMs = speed + this.enemyType;
    this.scoreBase = isBoss ? scoreBase : scoreBase * this.enemyType;
    this.healthBase = health || this.enemyType;
    this.health = this.healthBase;
    this.dead = false;
    this.isBoss = isBoss;
    this.winWidth = winWidth;
    this.winHeight = winHeight;
    this.img = new Image();
    this.img.src = `./img/zm-${this.enemyType}.png`;

    this.canAttack = true;

    this.setForEnemyOrBoss();

    if (Math.random() > 0.5) {
      this.x =
        Math.random() > 0.5 ? -this.enemyWidth : winWidth + this.enemyWidth;
      this.y = Math.random() * winHeight;
    } else {
      this.x = Math.random() * winWidth;
      this.y =
        Math.random() > 0.5 ? -this.enemyHeight : winHeight + this.enemyHeight;
    }

    this.directionCoords = this.setDirectionCoords();
  }

  setDirectionCoords() {
    return {
      x: cosBetweenTwoPoints(this.player.x, this.player.y, this.x, this.y),
      y: sinBetweenTwoPoints(this.player.x, this.player.y, this.x, this.y),
    };
  }

  changeIcon() {
    this.img.src = `./img/zm-${this.enemyType}-dead.png`;
    this.stepsCount = 0;
  }

  setForEnemyOrBoss() {
    if (this.isBoss) {
      this.stepsCount = 0;
      this.stepsCountStart = 0;
      this.changeFrameValue = 12;
      this.frameLimit = this.changeFrameValue * 3 - 1;
      this.deadFrameLimit = this.changeFrameValue * 4;
      this.enemyWidth = 70;
      this.enemyHeight = 70;
      this.radius = 25;
      this.hasDrop = Math.random() > 0.333 ? false : true;
    } else {
      this.stepsCount = 0;
      this.stepsCountStart = 0;
      this.changeFrameValue = 12;
      this.frameLimit = this.changeFrameValue * 2 - 1;
      this.deadFrameLimit = this.changeFrameValue * 4;
      this.enemyWidth = 60;
      this.enemyHeight = 60;
      this.radius = 20;
      this.hasDrop = Math.random() > 0.99;
    }
    this.dropSetted = false;
  }

  drawDeadImg() {
    if (this.stepsCount > this.deadFrameLimit) {
      this.canRemove = true;
    }

    let currvalue = {};
    let currentFrame = Math.floor(this.stepsCount / this.changeFrameValue);

    if (!this.isBoss) {
      switch (currentFrame) {
        case 0:
          currvalue.v = 0;
          currvalue.w = 40;
          break;

        case 1:
          currvalue.v = 40;
          currvalue.w = 45;
          break;

        default:
          currvalue.v = 90;
          currvalue.w = 45;
          break;
      }
    } else {
      switch (currentFrame) {
        case 0:
          currvalue.v = 20;
          currvalue.w = 70;
          break;

        case 1:
          currvalue.v = 78;
          currvalue.w = 70;
          break;

        case 2:
          currvalue.v = 140;
          currvalue.w = 70;
          break;

        default:
          currvalue.v = 185;
          currvalue.w = 70;
          break;
      }
    }

    this.ctx.drawImage(
      this.img,
      currvalue.v,
      0,
      currvalue.w,
      this.enemyHeight,
      this.x - this.enemyWidth / 2,
      this.y - this.enemyHeight / 2,
      this.enemyWidth + 25,
      this.enemyHeight + 25
    );
    this.stepsCount++;
  }

  drawImg() {
    let currvalue = {};
    let currentFrame = Math.floor(this.stepsCount / this.changeFrameValue);

    if (!this.isBoss) {
      switch (currentFrame) {
        case 0:
          currvalue.v = 15;
          currvalue.w = 40;
          break;

        case 1:
          currvalue.v = 60;
          currvalue.w = 40;
          break;

        case 2:
          currvalue.v = 100;
          currvalue.w = 40;
          break;
      }
    } else {
      switch (currentFrame) {
        case 0:
          currvalue.v = 7;
          currvalue.w = 70;
          break;

        case 1:
          currvalue.v = 76;
          currvalue.w = 70;
          break;

        case 2:
          currvalue.v = 132;
          currvalue.w = 70;
          break;
      }
    }

    if (this.stepsCount > this.frameLimit) {
      this.stepsCount = this.stepsCountStart;
    }

    if (
      !this.lastvalue ||
      this.lastvalue.v !== currvalue.v ||
      this.lastvalue.w !== currvalue.w
    ) {
      this.lastvalue = currvalue;
    }

    this.ctx.drawImage(
      this.img,
      this.lastvalue.v,
      0,
      this.lastvalue.w,
      50,
      this.x - this.enemyWidth / 2,
      this.y - this.enemyHeight / 2,
      this.enemyWidth,
      this.enemyHeight
    );
    this.stepsCount++;
  }

  draw() {
    if (!this.dead) {
      this.ctx.save();
      let angle = Math.atan2(this.player.y - this.y, this.player.x - this.x);
      this.lastAngle = angle;
      this.ctx.translate(this.x, this.y);
      this.ctx.rotate(angle + Math.PI / 2);
      this.ctx.translate(-this.x, -this.y);
      this.drawImg();
      this.ctx.restore();
    } else {
      this.ctx.save();
      this.ctx.translate(this.x, this.y);
      this.ctx.rotate(this.lastAngle + Math.PI / 2);
      this.ctx.translate(-this.x, -this.y);
      this.drawDeadImg();
      this.ctx.restore();
    }
  }

  directionCoordsUpdate(x, y) {
    this.directionCoords = {
      x: cosBetweenTwoPoints(
        x || this.player.x,
        y || this.player.y,
        this.x,
        this.y
      ),
      y: sinBetweenTwoPoints(
        x || this.player.x,
        y || this.player.y,
        this.x,
        this.y
      ),
    };
  }

  move() {
    this.x += this.directionCoords.x * this.enemyMs;
    this.y += this.directionCoords.y * this.enemyMs;
  }

  update() {
    if (!this.dead) {
      this.draw();
      this.move();
      this.directionCoordsUpdate();
    } else {
      this.draw();
    }
  }

  isAlive() {
    return this.health > 0;
  }

  decrease() {
    this.health--;
  }

  reload() {
    this.canAttack = false;
    setTimeout(() => (this.canAttack = true), 125);
  }

  getScorePoints() {
    return this.scoreBase;
  }

  setDrop() {
    let improvement = new Improvement(
      this.ctx,
      this.player,
      this.winWidth,
      this.winHeight,
      this.x,
      this.y
    );
    let machineGunClass = improvement.getImprovementClass('machineGun');
    let base;
    if (this.isBoss) {
      if (!this.superBoss) {
        base = Math.random() > 0.75 ? 2 : 1;
      } else {
        base = Math.random() > 0.33 ? 2 : 1;
      }
    } else {
      base = Math.random() > 0.66 ? 2 : 1;
    }
    let machineGunImprovement = improvement.getImprovement(
      machineGunClass,
      base
    );
    improvement.setImprovement(machineGunImprovement);
    this.drop = improvement;
    this.dropSetted = true;

    return improvement;
  }
}
