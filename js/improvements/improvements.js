import { HealthImprovement } from './healthImprovement.js';
import { AmmoImprovement } from './ammoImprovement.js';
import { MachineGunImprovement } from './machineGunImprovement.js';

const IMPROVEMENT_CLASS_LIST = {
  ammo: AmmoImprovement,
  health: HealthImprovement,
  machineGun: MachineGunImprovement,
};

export class Improvement {
  constructor(ctx, player, winWidth, winHeight, x, y) {
    this.ctx = ctx;
    this.player = player;
    this.winWidth = winWidth;
    this.winHeight = winHeight;

    this.defaultElemWidth = 50;
    this.defaultElemHeight = 50;
    this.defaultElemRadius = 25;

    const placeObj = this.getPlace();
    this.x = x || placeObj.x;
    this.y = y || placeObj.y;

    this.used = false;
  }

  use() {
    this.used = true;
    this.improvement.useImprovement();
  }

  getPlace() {
    let x = Math.random() * this.winWidth;
    let y = Math.random() * this.winHeight;

    if (x < this.defaultElemRadius) x = this.defaultElemRadius;
    if (y < this.defaultElemRadius) y = this.defaultElemRadius;
    if (x > this.winWidth - this.defaultElemRadius)
      x = this.winWidth - this.defaultElemRadius;
    if (y > this.winHeight - this.defaultElemRadius)
      y = this.winHeight - this.defaultElemRadius;

    return {
      x: x,
      y: y,
    };
  }

  getRandomImprovementClass() {
    const random = Math.random() > 0.8 ? 1 : 0;
    const improvement = random === 0 ? 'ammo' : 'health';
    return IMPROVEMENT_CLASS_LIST[improvement];
  }

  getImprovementClass(key) {
    if (IMPROVEMENT_CLASS_LIST.hasOwnProperty(key)) {
      return IMPROVEMENT_CLASS_LIST[key];
    }
    return null;
  }

  getImprovement(improvementClass, base = 1) {
    if (!improvementClass) {
      improvementClass = this.getRandomImprovementClass();
    }
    return new improvementClass(
      this.ctx,
      this.x,
      this.y,
      this.player,
      this.defaultElemWidth,
      this.defaultElemHeight,
      this.defaultElemRadius,
      base
    );
  }

  setImprovement(improvement) {
    this.improvement = improvement;
  }
}
