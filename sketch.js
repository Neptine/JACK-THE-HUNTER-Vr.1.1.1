class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene')
  }
  preload() {
    this.load.image('start', 'assets/startScreen.png')
  }
  create() {
    this.add.image(windowWidth / 2, windowHeight / 2, 'start')
    this.input.keyboard.on('keyup', (event) => {
      this.scene.end
      this.scene.start('GameScene')
    }, this)
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
    this.turnDegrees = 1
    this.victoryX
    this.victoryY
    this.time = 0
  }
  preload() {
    this.load.image('player', 'assets/player.png')
    this.load.image('zombie', 'assets/headcrab.png')
    this.load.image('block', 'assets/blocks.png', { frameWidth: 128 })
    this.load.image('floor', 'assets/floor.png', { frameWidth: 128 })
    this.load.image('startFloor', 'assets/startFloor.png', { frameWidth: 128 })
    this.load.image('endFloor', 'assets/endFloor.png', { frameWidth: 128 })
    this.load.image('reticle', 'assets/reticle.png')
    this.load.image('bullet', 'assets/bullet.png')
  }
  create() {
    this.addGroups()
    let emptySpaces = this.fillMaze(maze)
    this.setEnemies(emptySpaces)
    this.physics.world.setBounds(0, 0, 6 * (128 * 4), 6 * (128 * 4))
    this.player = new Player(this, 192, 458, 'player')
    this.players.add(this.player)
    this.reticle = this.physics.add.sprite(192, 522, 'reticle')
    this.declareColliders()
    this.cameras.main.startFollow(this.player)
    this.cameras.main.zoom = 1.5
  }
  update() {
    let cos = Math.cos(this.player.rotation + (Math.PI))
    let sin = Math.sin(this.player.rotation + (Math.PI))
    this.reticle.x = (this.player.x + cos * 300)
    this.reticle.y = (this.player.y + sin * 300)
  }
  fillMaze(maze) {
    let cells = []
    let emptySpaces = []
    maze.forEach((row) => {
      row.forEach((square) => {
        var arr = []
        arr.push(square.x)
        arr.push(square.y)
        this.translateToArrays(!square.top, !square.left, !square.right, !square.bottom, arr)
        cells.push(arr)
      })
    })
    for (let cellIdx = 0; cellIdx < cells.length; cellIdx++) {
      let rows = cells[cellIdx]
      for (let rowIdx = 2; rowIdx < rows.length; rowIdx++) {
        let squares = rows[rowIdx]
        for (let squareIdx = 0; squareIdx < squares.length; squareIdx++) {
          let x = (squareIdx + (rows[0] * 4)) * 128
          let y = (rowIdx + (rows[1] * 4)) * 128
          if (squares[squareIdx]) {
            this.walls.create(x, y, 'block')
          }
          else {
            let xWithinStartRange = (x >= 128 && x <= 384)
            let yWithinStartRange = (y >= 256 && y <= 512)
            let xWithinEndRange = (x >= (512 * (rows.length - .75)) && x <= (512 * (rows.length - .25)))
            let yWithinEndRange = (y >= (512 * (rows.length - .75) + 128) && y <= (512 * (rows.length - .25) + 128))
            this.victoryX = 512 * (rows.length - .75)
            this.victoryY = 512 * (rows.length - .75) + 128
            if (xWithinStartRange && yWithinStartRange) {
              this.startFloor.create(x, y, 'startFloor')
            }
            else if (xWithinEndRange && yWithinEndRange) {
              this.endFloor.create(x, y, 'endFloor')

            }
            else {
              this.floors.create(x, y, 'floor')
              emptySpaces.push([x, y])
            }
          }
        }
      }
    }
    return emptySpaces
  }
  setEnemies(emptySpaces) {
    emptySpaces.forEach((space) => {
      if ((Math.random() * Math.floor(5)) > 2) {
        this.enemy = new Enemy(this, space[0], space[1], 'zombie')
        this.enemies.add(this.enemy)
      }
    })
  }
  addGroups() {
    this.walls = this.physics.add.staticGroup()
    this.startFloor = this.physics.add.staticGroup()
    this.endFloor = this.physics.add.staticGroup()
    this.floors = this.physics.add.staticGroup()
    this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true })
    this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
    this.players = this.physics.add.group({ classType: Player, runChildUpdate: true })
  }
  declareColliders() {
    this.physics.add.collider(this.enemies, this.walls)
    this.physics.add.collider(this.enemies, this.startFloor)
    this.physics.add.collider(this.enemies, this.enemies)
    this.physics.add.collider(this.enemies, this.players, this.enemyHitsPlayer)
    this.physics.add.collider(this.enemies, this.bullets, this.bulletsHitEnemy)
    this.physics.add.collider(this.players, this.walls)
    this.physics.add.collider(this.walls, this.bullets, this.bulletHitsWall)
  }
  translateToArrays(topIsOpen, leftIsOpen, rightIsOpen, bottomIsOpen, arr) {
    if (topIsOpen) {
      arr.push([1, 0, 0, 1])
    }
    else {
      arr.push([1, 1, 1, 1])
    }

    if (rightIsOpen) {
      if (leftIsOpen) {
        arr.push([0, 0, 0, 0])
        arr.push([0, 0, 0, 0])
      }
      else {
        arr.push([1, 0, 0, 0])
        arr.push([1, 0, 0, 0])
      }
    }
    else if (leftIsOpen) {
      arr.push([0, 0, 0, 1])
      arr.push([0, 0, 0, 1])
    }
    else {
      arr.push([1, 0, 0, 1])
      arr.push([1, 0, 0, 1])
    }

    if (bottomIsOpen) {
      arr.push([1, 0, 0, 1])
    }
    else {
      arr.push([1, 1, 1, 1])
    }
    return arr
  }
  bulletHitsWall(wallHit, bulletHit) {
    bulletHit.setActive(false).setVisible(false)

  }
  bulletsHitEnemy(enemyHit, bulletHit) {
    enemyHit.health -= 1
    if (enemyHit.health <= 0) {
      enemyHit.destroy()
    }
    bulletHit.setActive(false).setVisible(false)
  }
  enemyHitsPlayer(enemyHit, playerHit) {
    playerHit.health -= 1
  }
}

class EndGameScene extends Phaser.Scene {
  constructor() {
    super('EndGameScene')
  }
  preload() {
    this.load.image('winGame', 'assets/winGame.png')
    this.load.image('loseGame', 'assets/loseGame.png')
  }
  create() {
    if (gameWon) {
      this.add.image(windowWidth / 2, windowHeight / 2, 'winGame')
      this.input.keyboard.on('keyup', (event) => {
        this.scene.start('GameScene')
      })
    }
    else {
      this.add.image(windowWidth / 2, windowHeight / 2, 'loseGame')
      this.input.keyboard.on('keyup', (event) => {
        this.scene.start('GameScene')
      })
    }
  }
}

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
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
    this.setPosition(x, y)
    this.turnDegrees = 1
    scene.add.existing(this)
  }
  update() {
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
    let bullet = this.scene.bullets.get(this.scene, 'bullet')
    bullet.setActive(true).setVisible(true)
    if (bullet) {
      bullet.fire(this.scene.player, this.scene.reticle)
    }
  }
}

class Bullet extends Phaser.GameObjects.Image {
  constructor(scene) {
    super(scene, 0, 0, 'bullet')
    this.speed = 2;
    this.direction = 0;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.setRotation(Math.PI)
    this.setSize(12, 12, true)
    this.angle = scene.player.angle + 270
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
  update(time, delta) {
    this.x += this.xSpeed * delta;
    this.y += this.ySpeed * delta;
  }
}

class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture)
    this.speed = 100
    this.health = 15
    this.setPosition(x, y)
    scene.add.existing(this)
  }
  update() {
    let withinXRange = ((this.x >= (this.scene.player.x - 384)) && (this.x <= (this.scene.player.x + 384)))
    let withinYRange = ((this.y >= (this.scene.player.y - 384)) && (this.y <= (this.scene.player.y + 384)))
    if (withinXRange && withinYRange) {
      this.direction = Math.atan((this.scene.player.x - this.x) / (this.scene.player.y - this.y));
      if (this.y <= this.scene.player.y) {
        this.setVelocityX(this.speed * Math.sin(this.direction))
        this.setVelocityY(this.speed * Math.cos(this.direction))
      }
      else {
        this.setVelocityX(-this.speed * Math.sin(this.direction))
        this.setVelocityY(-this.speed * Math.cos(this.direction))
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

var gameWon
var windowWidth = 2000
var windowHeight = 1000
var maze = [
  [
    {
      x: 0,
      y: 0,
      top: true,
      left: true,
      bottom: false,
      right: true,
      set: 6
    },
    {
      x: 1,
      y: 0,
      top: true,
      left: true,
      bottom: true,
      right: false,
      set: 4
    },
    {
      x: 2,
      y: 0,
      top: true,
      left: false,
      bottom: false,
      right: false,
      set: 4
    },
    {
      x: 3,
      y: 0,
      top: true,
      left: false,
      bottom: false,
      right: true,
      set: 4
    },
    {
      x: 4,
      y: 0,
      top: true,
      left: true,
      bottom: false,
      right: true,
      set: 2
    },
    {
      x: 5,
      y: 0,
      top: true,
      left: true,
      bottom: false,
      right: true,
      set: 1
    }
  ],
  [
    {
      x: 0,
      y: 1,
      top: false,
      left: true,
      bottom: false,
      right: false,
      set: 6
    },
    {
      x: 1,
      y: 1,
      top: true,
      left: false,
      bottom: true,
      right: false,
      set: 6
    },
    {
      x: 2,
      y: 1,
      top: false,
      left: false,
      bottom: false,
      right: true,
      set: 6
    },
    {
      x: 3,
      y: 1,
      top: false,
      left: true,
      bottom: false,
      right: false,
      set: 6
    },
    {
      x: 4,
      y: 1,
      top: false,
      left: false,
      bottom: false,
      right: false,
      set: 6
    },
    {
      x: 5,
      y: 1,
      top: false,
      left: false,
      bottom: true,
      right: true,
      set: 6
    }
  ],
  [
    {
      x: 0,
      y: 2,
      top: false,
      left: true,
      bottom: false,
      right: true,
      set: 6
    },
    {
      x: 1,
      y: 2,
      top: true,
      left: true,
      bottom: false,
      right: true,
      set: 1
    },
    {
      x: 2,
      y: 2,
      top: false,
      left: true,
      bottom: false,
      right: true,
      set: 6
    },
    {
      x: 3,
      y: 2,
      top: false,
      left: true,
      bottom: false,
      right: true,
      set: 6
    },
    {
      x: 4,
      y: 2,
      top: false,
      left: true,
      bottom: false,
      right: false,
      set: 6
    },
    {
      x: 5,
      y: 2,
      top: true,
      left: false,
      bottom: true,
      right: true,
      set: 6
    }
  ],
  [
    {
      x: 0,
      y: 3,
      top: false,
      left: true,
      bottom: false,
      right: true,
      set: 1
    },
    {
      x: 1,
      y: 3,
      top: false,
      left: true,
      bottom: false,
      right: false,
      set: 1
    },
    {
      x: 2,
      y: 3,
      top: false,
      left: false,
      bottom: true,
      right: true,
      set: 1
    },
    {
      x: 3,
      y: 3,
      top: false,
      left: true,
      bottom: false,
      right: true,
      set: 1
    },
    {
      x: 4,
      y: 3,
      top: false,
      left: true,
      bottom: false,
      right: true,
      set: 1
    },
    {
      x: 5,
      y: 3,
      top: true,
      left: true,
      bottom: false,
      right: true,
      set: 3
    }
  ],
  [
    {
      x: 0,
      y: 4,
      top: false,
      left: true,
      bottom: true,
      right: true,
      set: 1
    },
    {
      x: 1,
      y: 4,
      top: false,
      left: true,
      bottom: true,
      right: false,
      set: 1
    },
    {
      x: 2,
      y: 4,
      top: true,
      left: false,
      bottom: true,
      right: true,
      set: 1
    },
    {
      x: 3,
      y: 4,
      top: false,
      left: true,
      bottom: true,
      right: true,
      set: 1
    },
    {
      x: 4,
      y: 4,
      top: false,
      left: true,
      bottom: false,
      right: false,
      set: 1
    },
    {
      x: 5,
      y: 4,
      top: false,
      left: false,
      bottom: true,
      right: true,
      set: 1
    }
  ],
  [
    {
      x: 0,
      y: 5,
      top: true,
      left: true,
      bottom: true,
      right: false,
      set: 2
    },
    {
      x: 1,
      y: 5,
      top: true,
      left: false,
      bottom: true,
      right: false,
      set: 2
    },
    {
      x: 2,
      y: 5,
      top: true,
      left: false,
      bottom: true,
      right: false,
      set: 2
    },
    {
      x: 3,
      y: 5,
      top: true,
      left: false,
      bottom: true,
      right: false,
      set: 2
    },
    {
      x: 4,
      y: 5,
      top: false,
      left: false,
      bottom: true,
      right: false,
      set: 2
    },
    {
      x: 5,
      y: 5,
      top: true,
      left: false,
      bottom: true,
      right: true,
      set: 2
    }
  ]
]
var config = {
  type: Phaser.AUTO,
  width: windowWidth,
  height: windowHeight,
  scene: [StartScene, GameScene, EndGameScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
}

var game = new Phaser.Game(config)