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
var sounds = { player: { jump: null } };
var game = new Phaser.Game(config);

function preload() {
  this.load.image('sky', 'assets/sky.png');
  this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
  this.load.audio('jump', 'assets/jump.wav');
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

  cursors = this.input.keyboard.createCursorKeys();

  sounds.player.jump = this.sound.add('jump');
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

  // TODO Constraint player.body.touching.down
  if (cursors.up.isDown) {
      player.setVelocityY(-330);
      if (!sounds.player.jump.isPlaying) {
        sounds.player.jump.play();
      }
  }
}
