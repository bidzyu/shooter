import { cosBetweenTwoPoints, sinBetweenTwoPoints } from './utilities.js';

export class Bullet {
  constructor(
    playerX,
    playerY,
    targetX,
    targetY,
    ctx,
    winWidth,
    winHeight,
    player
  ) {
    this.x = playerX;
    this.y = playerY;
    this.ctx = ctx;
    this.radius = 4;
    this.bulletSpeed = 20;
    this.shooter = player;
    this.color = 'orange';
    this.directionCoords = {
      x: cosBetweenTwoPoints(targetX, targetY, playerX, playerY),
      y: sinBetweenTwoPoints(targetX, targetY, playerX, playerY),
    };
    this.winWidth = winWidth;
    this.winHeight = winHeight;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.arc(
      this.x + this.directionCoords.x * 20,
      this.y + this.directionCoords.y * 20,
      this.radius,
      0,
      Math.PI * 2
    );
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.closePath();
  }

  update() {
    this.draw();
    this.updateCoords();
  }

  updateCoords() {
    this.x += this.directionCoords.x * this.bulletSpeed;
    this.y += this.directionCoords.y * this.bulletSpeed;
  }

  bulletOnWindow() {
    return !(
      this.x < 0 ||
      this.x > this.winWidth ||
      this.y < 0 ||
      this.y > this.winHeight
    );
  }
}
