export class MachineGunImprovement {
  constructor(ctx, x, y, player, elemWidth, elemHeight, elemRadius, base) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.player = player;

    this.baseBoost = 15;
    let boost = this.baseBoost * base;
    this.boost = boost;
    let imgNum = boost > this.baseBoost ? 2 : 1;

    this.img = new Image();
    this.img.src = `./img/auto-${imgNum}.png`;

    this.width = elemWidth;
    this.height = elemHeight;
    this.radius = elemRadius;
  }

  useImprovement() {
    this.player.clicker.setAutoNow(this.boost, this.player);
  }

  draw() {
    this.ctx.drawImage(
      this.img,
      0,
      0,
      this.width,
      this.height,
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
  }

  update() {
    this.draw();
  }
}
