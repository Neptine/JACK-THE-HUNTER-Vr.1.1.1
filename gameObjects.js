class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture){
    super(scene, x, y, texture)
    this.moveKeys = scene.input.keyboard.addKeys({
      'moveUp': Phaser.Input.Keyboard.KeyCodes.W,
      'moveDown': Phaser.Input.Keyboard.KeyCodes.S,
      'moveLeft': Phaser.Input.Keyboard.KeyCodes.A,
      'moveRight': Phaser.Input.Keyboard.KeyCodes.D,
      'turnRight': Phaser.Input.Keyboard.KeyCodes.RIGHT,
      'turnLeft': Phaser.Input.Keyboard.KeyCodes.LEFT,
      'shoot': Phaser.Input.Keyboard.KeyCodes.SPACE,
      'turnDown': Phaser.Input.Keyboard.KeyCodes.DOWN,
      'turnUp': Phaser.Input.Keyboard.KeyCodes.UP,
    })
    this.speed = 1
    this.health = 4
    this.angle = 270
    this.setPosition(x,y)
    this.turnDegrees = 1
    scene.add.existing(this)
  }
  update(){
    this.checkMovement()
    this.constrainVelocity(400)
    if (this.x >= this.scene.victoryX && this.y >= this.scene.victoryY) {
      gameWon = true
      game.scene.start('EndGameScene')
    }
    else if (this.health < 1) {
      gameWon = false
      game.scene.start('EndGameScene')
    }
  }
  constrainVelocity(maxVelocity) {
    if (!this || !this.body)
      return;

    var angle, currVelocitySqr, vx, vy;
    vx = this.body.velocity.x;
    vy = this.body.velocity.y;
    currVelocitySqr = vx * vx + vy * vy;

    if (currVelocitySqr > maxVelocity * maxVelocity) {
      angle = Math.atan2(vy, vx);
      vx = Math.cos(angle) * maxVelocity;
      vy = Math.sin(angle) * maxVelocity;
      this.body.velocity.x = vx;
      this.body.velocity.y = vy;
    }
  }
  checkTurnKeys() {
    if (this.moveKeys.turnLeft.isDown) {
      this.angle += -this.turnDegrees
    }
    else if (this.moveKeys.turnRight.isDown) {
      this.angle += this.turnDegrees
    }
    else if (this.moveKeys.turnDown.isDown) {
      this.angle = -90
    }
    else if (this.moveKeys.turnUp.isDown) {
      this.angle = 90
    }

  }
  checkMovement() {
    if (this.moveKeys.moveUp.isDown) {
      this.checkTurnKeys()
    if (this.moveKeys.shoot.isDown) {
      this.fireGun()
    }
      this.setVelocityY(-400)
    }
    else if (this.moveKeys.moveDown.isDown) {
      this.checkTurnKeys()
      if (this.moveKeys.shoot.isDown) {
        this.fireGun()
      }
      this.setVelocityY(400)
    }
    else if (this.moveKeys.moveLeft.isDown) {
      this.checkTurnKeys()
      if (this.moveKeys.shoot.isDown) {
        this.fireGun()
      }
      this.setVelocityX(-400)

    }
    else if (this.moveKeys.moveRight.isDown) {
      this.checkTurnKeys()
      if (this.moveKeys.shoot.isDown) {
        this.fireGun()
      }
      this.setVelocityX(400)      
    }
    else {
      if (this.moveKeys.shoot.isDown) {
        this.fireGun()
      }
      this.setVelocityY(0)
      this.setVelocityX(0)

    }
    this.checkTurnKeys()
  }
  fireGun() {
    let bullet = this.scene.bullets.get(this.scene,'bullet')
    bullet.setActive(true).setVisible(true)
    if (bullet) {
      bullet.fire(this.scene.player, this.scene.reticle)
    }
  }
}

class Bullet extends Phaser.GameObjects.Image {
  constructor(scene){
    super(scene, 0, 0, 'bullet')
    this.speed = 2;
    this.direction = 0;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.setRotation(Math.PI)
    this.setSize(12, 12, true);
  }
  fire(player, reticle) {
    this.setPosition(player.x, player.y);
    this.direction = Math.atan((reticle.x - this.x) / (reticle.y - this.y));
    if (reticle.y >= this.y) {
      this.xSpeed = this.speed * Math.sin(this.direction);
      this.ySpeed = this.speed * Math.cos(this.direction);
    }
    else {
      this.xSpeed = -this.speed * Math.sin(this.direction);
      this.ySpeed = -this.speed * Math.cos(this.direction);
    }
    this.angle = player.angle + 270;
  }
  update(time, delta){
    this.x += this.xSpeed * delta;
    this.y += this.ySpeed * delta;
  }
}

class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture){
    super(scene, x, y, texture)
    this.speed = 100
    this.health = 15
    this.setPosition(x, y)
    scene.add.existing(this)
  }
  update(){
    let withinXRange = ((this.x >= (this.scene.player.x - 256)) && (this.x <= (this.scene.player.x + 256)))
    let withinYRange = ((this.y >= (this.scene.player.y - 256)) && (this.y <= (this.scene.player.y + 256)))
    if (withinXRange && withinYRange) {
      this.direction = Math.atan((this.scene.player.x - this.x) / (this.scene.player.y - this.y));
      if (this.y <= this.scene.player.y) {
        this.setVelocityX(this.speed*Math.sin(this.direction))
        this.setVelocityY(this.speed*Math.cos(this.direction))
      }
      else {
        this.setVelocityX(-this.speed*Math.sin(this.direction))
        this.setVelocityY(-this.speed*Math.cos(this.direction))
      }
    }
    this.constrainVelocity(300)
  }
  constrainVelocity(maxVelocity) {
    if (!this || !this.body)
      return;

    var angle, currVelocitySqr, vx, vy;
    vx = this.body.velocity.x;
    vy = this.body.velocity.y;
    currVelocitySqr = vx * vx + vy * vy;

    if (currVelocitySqr > maxVelocity * maxVelocity) {
      angle = Math.atan2(vy, vx);
      vx = Math.cos(angle) * maxVelocity;
      vy = Math.sin(angle) * maxVelocity;
      this.body.velocity.x = vx;
      this.body.velocity.y = vy;
    }
  }
}
