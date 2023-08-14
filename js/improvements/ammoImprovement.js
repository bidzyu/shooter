export class AmmoImprovement {
  constructor(ctx, x, y, player, elemWidth, elemHeight, elemRadius) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.player = player;
    this.ammoType = Math.random() > 0.75 ? 2 : 1;
    this.ammoIncrease = 25 * this.ammoType;

    this.img = new Image();
    this.img.src = `./img/ammo-${this.ammoType}.png`;

    this.width = elemWidth;
    this.height = elemHeight;
    this.radius = elemRadius;
  }

  useImprovement() {
    this.player.increaseAmmo(this.ammoIncrease);
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
