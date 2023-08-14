export class HealthImprovement {
  constructor(ctx, x, y, player, elemWidth, elemHeight, elemRadius) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.player = player;

    this.width = elemWidth;
    this.height = elemHeight;
    this.radius = elemRadius;

    this.healthIncrease = Math.random() > 0.8 ? 50 : 25;
    this.color1 = this.healthIncrease === 25 ? '#aaa' : '#eee';
    this.color2 = this.healthIncrease === 25 ? '#7c1919' : '#ba0303';
  }

  useImprovement() {
    this.player.increaseHealth(this.healthIncrease);
  }

  draw() {
    const x = this.x;
    const y = this.y;

    this.ctx.beginPath();
    this.ctx.fillStyle = this.color1;
    this.ctx.fillRect(
      x - this.width / 2,
      y - this.height / 2,
      this.width,
      this.height
    );
    this.ctx.fillStyle = this.color2;
    this.ctx.moveTo(x - 10, y - 20);
    this.ctx.lineTo(x + 10, y - 20);
    this.ctx.lineTo(x + 10, y - 10);
    this.ctx.lineTo(x + 20, y - 10);
    this.ctx.lineTo(x + 20, y + 10);
    this.ctx.lineTo(x + 10, y + 10);
    this.ctx.lineTo(x + 10, y + 20);
    this.ctx.lineTo(x + 10, y + 20);
    this.ctx.lineTo(x - 10, y + 20);
    this.ctx.lineTo(x - 10, y + 10);
    this.ctx.lineTo(x - 20, y + 10);
    this.ctx.lineTo(x - 20, y - 10);
    this.ctx.lineTo(x - 10, y - 10);
    this.ctx.lineTo(x - 10, y - 20);
    this.ctx.fill();
    this.ctx.closePath();
  }

  update() {
    this.draw();
  }
}
