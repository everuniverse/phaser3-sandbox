var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var player;
var cursors;
var bullets;

var game = new Phaser.Game(config);

function preload() {
  this.load.image('sky', 'assets/sky.png');
  this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
  this.load.audio('jump', 'assets/jump.wav');
  this.load.image('bullet', 'assets/bullet.png');
}

function create() {
  this.add.image(400, 300, 'sky');

  player = this.physics.add.sprite(400, 100, 'dude');
  player.body.setBounce(0.2);
  player.body.collideWorldBounds = true;
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: 'turn',
    frames: [{ key: 'dude', frame: 4 }],
    frameRate: 20
  });
  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  var Bullet = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize: function Bullet (scene) {
      Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
      this.speed = Phaser.Math.GetSpeed(400, 1);
    },
    shoot: function (x, y) {
      this.setPosition(x, y);
      this.setActive(true);
      this.setVisible(true);
    },
    update: function (time, delta) {
      this.x += this.speed * delta;
      if (this.x < 0 || game.config.width < this.x) {
        this.setActive(false);
        this.setVisible(false);
      }
    }
  });
  bullets = this.add.group({
    classType: Bullet,
    maxSize: 1,
    runChildUpdate: true
  });

  cursors = this.input.keyboard.createCursorKeys();

  this.sfx = {
    jump: this.sound.add('jump')
  };
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);
    player.anims.play('turn');
  }
  if (cursors.up.isDown) {
    player.setVelocityY(-330);
    if (!this.sfx.jump.isPlaying) {
      this.sfx.jump.play();
    }
  }
  if (cursors.down.isDown) {
    var bullet = bullets.get();
    if (bullet) {
      bullet.shoot(player.x, player.y+15);
    }
  }
}
