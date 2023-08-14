import { Bullet } from './bullet.js';

export class BossBullet extends Bullet {
  constructor(...args) {
    super(...args);
    this.radius = this.shooter.superBoss ? 7 : 5;
    this.color = this.shooter.superBoss ? 'blue' : 'red';
    this.bulletSpeed = 15;

    this.new = true;
  }

  returnBulletStatusAndSwitch() {
    if (this.new) {
      this.new = false;
      return true;
    }
    return false;
  }
}
