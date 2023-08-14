const DEVICES_TO_CONTROLLER =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i;

window.onresize = function () {
  window.location.reload();
};

import { Player } from './player.js';
import { Bullet } from './bullet.js';
import { Enemy } from './enemy.js';
import { Boss } from './boss.js';
import { Improvement } from './improvements/improvements.js';
import { Clicker } from './clicker.js';
import { distanceBetweenTwoPoint } from './utilities.js';
import { Controller } from './controller.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.addEventListener('contextmenu', function (event) {
  event.preventDefault();
  return;
});

const width = (canvas.width = document.documentElement.clientWidth);
const height = (canvas.height = document.documentElement.clientHeight);

let player;
let score;
let health;
let ammo;
let ammoLimit;
let clicker;
let bullets = [];
let allBossesBullets;
let newBossesBullets;
let bossesBullets = [];
let bosses = [];
let enemies = [];
let improvements = [];
let animationFrameId;
let spawnEnemiesId;
let spawnImprovementsId;
let bossSpawner;
let bossTimer;
let controller;
let isMobile;

const startGameElem = document.getElementById('start-game');
const startGameBtn = document.getElementById('start');
const controlsBtn = document.getElementById('controls');
const controlsQuitBtn = document.getElementById('controls-quit');
const controlsField = document.getElementById('controls-field');
const gameOverElem = document.getElementById('game-over');
const tryAgainBtn = document.getElementById('try-again');
const scoreBoardElem = document.getElementById('score-board');
const scoreElem = document.getElementById('score');
const topScoreElem = document.getElementById('top-score');
const healthBarElem = document.getElementById('health-bar');
const healthElem = document.getElementById('health');
const ammoBarElem = document.getElementById('ammo-bar');
const ammoElem = document.getElementById('ammo');
const ammoAutoElem = document.getElementById('ammo-auto');

startGameBtn.addEventListener('click', startGame, { once: true });
controlsBtn.addEventListener('click', showControls);
controlsQuitBtn.addEventListener('click', showMenu);

function animate() {
  animationFrameId = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, width, height);

  bosses = enemies.filter((enemy) => enemy.isBoss);
  allBossesBullets = bosses.reduce((res, boss) => {
    let currBossBullets = boss.bullets;
    res.push(...currBossBullets);
    return res;
  }, []);
  newBossesBullets = allBossesBullets.filter((bullet) =>
    bullet.returnBulletStatusAndSwitch()
  );
  bossesBullets.push(...newBossesBullets);
  bossesBullets = bossesBullets.filter((bossesBullet) =>
    bossesBullet.bulletOnWindow()
  );
  bullets = bullets.filter((bullet) => bullet.bulletOnWindow());
  bosses.forEach((boss) => {
    if (!boss.isAlive() && boss.isShoot) {
      boss.stopShoot();
    }
  });
  enemies.forEach((enemy) => {
    if (!enemy.canAttack) return;

    let dictance =
      distanceBetweenTwoPoint(player.x, player.y, enemy.x, enemy.y) -
      enemy.radius -
      player.radius;
    if (dictance < 0) {
      health = player.decreaseHealth(Math.floor(1 + Math.random() * 3));
      healthElem.innerHTML = health;
      enemy.reload();

      if (!player.isAlive()) {
        stopGame();
      }
    }
  });
  bossesBullets.forEach((bossesBullet, index) => {
    if (isHit(player, bossesBullet)) {
      bossesBullet.canRemove = true;
      if (bossesBullet.shooter.superBoss) {
        health = player.decreaseHealth(Math.floor(21 + Math.random() * 5));
      } else {
        health = player.decreaseHealth(Math.floor(11 + Math.random() * 5));
      }

      healthElem.innerHTML = health;
      if (!player.isAlive()) {
        stopGame();
      }
    }
  });
  bossesBullets = bossesBullets.filter(
    (bossesBullet) => !bossesBullet.canRemove
  );
  enemies.forEach((enemy) => {
    if (enemy.dead) return;

    bullets.some((bullet, index) => {
      if (isHit(enemy, bullet)) {
        bullets.splice(index, 1);
        enemy.decrease();
      }
    });
  });
  enemies.forEach((enemy) => {
    if (!enemy.isAlive() && !enemy.dead) {
      enemy.dead = true;
      enemy.canAttack = false;
      enemy.changeIcon();
      score += enemy.getScorePoints();
      scoreElem.innerHTML = score;
      bossSpawner();

      if (enemy.hasDrop && !enemy.dropSetted) {
        improvements.push(enemy.setDrop());
      }
    }
  });
  enemies = enemies.filter((enemy) => !enemy.canRemove);
  improvements.forEach((improvement) => {
    let improvementElem = improvement.improvement;

    let dictance =
      distanceBetweenTwoPoint(
        player.x,
        player.y,
        improvementElem.x,
        improvementElem.y
      ) -
      improvementElem.radius -
      player.radius;

    if (dictance > 0) return;

    improvement.use();
  });
  improvements = improvements.filter((improvement) => !improvement.used);
  improvements.forEach((improvement) => improvement.improvement.update());
  enemies.forEach((enemy) => enemy.update());
  player.update();
  bullets.forEach((bullet) => bullet.update());
  bossesBullets.forEach((bossBullet) => bossBullet.update());
}

function shoot(event, coords) {
  if (player.ammo <= 0) return;
  player.decreaseAmmo();

  let x, y;

  if (!event) {
    x = coords.x;
    y = coords.y;
  } else {
    x = event.clientX;
    y = event.clientY;
  }

  const bullet = new Bullet(
    player.x,
    player.y,
    x,
    y,
    ctx,
    width,
    height,
    player
  );
  bullets.push(bullet);
}

function isHit(enemy, bullet) {
  let value = distanceBetweenTwoPoint(enemy.x, enemy.y, bullet.x, bullet.y);
  return value - enemy.radius - bullet.radius < 0;
}

function showControls() {
  startGameElem.style.display = 'none';
  controlsField.style.display = 'block';
}

function showMenu() {
  startGameElem.style.display = '';
  controlsField.style.display = '';
}

function startGame() {
  startGameElem.style.display = 'none';
  gameOverElem.style.display = 'none';
  document.body.style.cursor = 'cell';
  init();
  if (isMobile) {
    document.body.append(controller.getControllerElem());
    controller.setController();
  }
  animate();
}

function stopGame() {
  clicker.stop();
  if (isMobile) {
    controller.removeController();
    controller.getControllerElem().remove();
  }
  queueMicrotask(clearInit);
  clearTimeout(spawnEnemiesId);
  clearTimeout(spawnImprovementsId);
  clearTimeout(bossTimer);
  cancelAnimationFrame(animationFrameId);
  updTopScore();
  healthElem.innerHTML = 0;
  gameOverElem.style.display = 'flex';
  document.body.style.cursor = '';

  tryAgainBtn.addEventListener('click', startGame, { once: true });
  setTimeout(() => ctx.clearRect(0, 0, width, height));
}

function init() {
  clicker = new Clicker(shoot, 60, ammoAutoElem, canvas);
  setTimeout(() => {
    // document.addEventListener('click', shoot);
    clicker.start();
  });
  bossSpawner = bossSetaper();
  score = 0;
  health = 100;
  ammo = 50;
  ammoLimit = 250;
  scoreElem.innerHTML = score;
  healthElem.innerHTML = health;
  ammoElem.innerHTML = ammo;
  scoreBoardElem.style.display =
    healthBarElem.style.display =
    ammoBarElem.style.display =
      'block';
  player = new Player(
    width / 2,
    height / 2,
    ctx,
    width,
    height,
    health,
    healthElem,
    ammo,
    ammoLimit,
    ammoElem,
    clicker
  );
  if (isMobile) {
    controller = new Controller(player.getKeyMap());
  }
  bullets = [];
  enemies = [];
  improvements = [];
  allBossesBullets;
  newBossesBullets;
  bossesBullets = [];
  bosses = [];
  spawnEnemies();
  spawnImprovements();
}

function clearInit() {
  clicker = null;
  controller = null;
  animationFrameId = null;
  spawnEnemiesId = null;
  player = null;
  enemies = null;
  bullets = null;
  improvements = null;
  allBossesBullets = null;
  newBossesBullets = null;
  bossesBullets = null;
  bosses = null;
  bossSpawner = null;
}

function updTopScore() {
  let prevScore = +topScoreElem.innerHTML;
  let newScore = +scoreElem.innerHTML;

  if (newScore > prevScore) {
    topScoreElem.innerHTML = newScore;
  }
}

function bossSetaper() {
  const increaseHp = 2;
  const increaseSpeed = 0.1;
  let startHp = 5;
  let startSpeed = 1.5;
  let canSetBoss = false;
  let randomBase = 45000;
  let randomBaseAdd = 15000;
  let randomBossCountBase = 10;
  let divider = randomBossCountBase;
  let prevBossCount = 1;
  let basePoint = 500;
  bossTimer = setTimeout(() => (canSetBoss = true), 60000);

  return function () {
    if (canSetBoss) {
      canSetBoss = false;

      let ms = randomBase + Math.random() * randomBaseAdd;

      let count = Math.floor(randomBossCountBase / divider);
      let nextStepCount = Math.floor((randomBossCountBase + 1) / divider);
      let isSuperBoss = nextStepCount > count;

      if (count !== prevBossCount) {
        startHp -= increaseHp * (divider - 1);
        startSpeed -= increaseSpeed * (divider - 1);
      }
      randomBossCountBase++;

      setBoss(count, startSpeed, basePoint, startHp, isSuperBoss);
      bossTimer = setTimeout(() => (canSetBoss = true), ms);

      startHp += increaseHp;
      startSpeed += increaseSpeed;
      prevBossCount = count;
    }
  };
}

function setBoss(bossCount, speed, basePoint, health, isSuperBoss) {
  for (let i = 0; i < bossCount; i++) {
    const boss = new Boss(
      ctx,
      player,
      width,
      height,
      speed,
      basePoint,
      true,
      health
    );
    if (isSuperBoss) {
      boss.superBoss = true;
      boss.upgrade();
    }
    enemies.push(boss);
  }
}

function createEnemy(count, speed, scoreBase) {
  for (let i = 0; i < count; i++) {
    enemies.push(new Enemy(ctx, player, width, height, speed, scoreBase));
  }
}

function spawnEnemies(diff = { ms: 2000, speed: 0.5, scoreBase: 10 }) {
  let ms = diff.ms;
  let speed = diff.speed;
  let scoreBase = diff.scoreBase;
  let tick = 0;

  function spawn() {
    let randomNum = Math.random();
    let spawnCount;

    if (randomNum > 0.91) {
      spawnCount = 3;
    } else if (randomNum > 0.71) {
      spawnCount = 2;
    } else {
      spawnCount = 1;
    }
    createEnemy(spawnCount, speed, scoreBase);

    speed += 0.003;
    if (tick > 0 && tick % 25 === 0) {
      scoreBase++;
    }
    tick++;
    ms -= 1;

    spawnEnemiesId = setTimeout(spawn, ms);
  }
  spawnEnemiesId = spawn();
}
//

function createImprovement() {
  let count = Math.random() > 0.95 ? 2 : 1;

  for (let i = 0; i < count; i++) {
    const improvement = new Improvement(ctx, player, width, height);
    improvement.setImprovement(improvement.getImprovement());
    improvements.push(improvement);
  }
}

function spawnImprovements() {
  let base = 1e4;
  let value = 1e4;
  let ms = base + Math.random() * 3e3;

  function spawn() {
    ms = base + Math.random() * value;
    base -= 1;
    value -= 1;
    createImprovement();

    spawnImprovementsId = setTimeout(spawn, ms);
  }

  spawnImprovementsId = setTimeout(spawn, ms);
}
