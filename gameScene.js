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
          this.enemy = new Enemy(this,space[0], space[1], 'zombie')
          this.enemies.add(this.enemy)
        }
      })
    }
    addGroups() {
      this. walls = this.physics.add.staticGroup()
      this.startFloor = this.physics.add.staticGroup()
      this.endFloor = this.physics.add.staticGroup()
      this.floors = this.physics.add.staticGroup()
      this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true })
      this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
      this.players = this.physics.add.group({ classType: Player, runChildUpdate: true})
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
    enemyHitsPlayer(enemyHit, playerHit){
      playerHit.health -= 1
    }
    checkTurnKeys(){
      if (this.moveKeys.turnLeft.isDown) {
        this.angle += -8
      }
      else if (this.moveKeys.turnRight.isDown) {
        this.angle += 8
      }
      else if (this.moveKeys.turnDown.isDown) {
        this.angle = 90
      }
      else if (this.moveKeys.turnUp.isDown) {
        this.angle = -90
      }
  
    }
    checkMovement() {
      if (moveKeys.moveUp.isDown) {
        this.checkTurnKeys()
        this.player.setAccelerationY(-800);
      }
      else if (moveKeys.moveDown.isDown) {
        this.checkTurnKeys()
        this.player.setAccelerationY(800);
      }
      else if (moveKeys.moveLeft.isDown) {
        this.checkTurnKeys()
        this.player.setAccelerationX(-800);
      }
      else if (moveKeys.moveRight.isDown) {
        this.checkTurnKeys()
        this.player.setAccelerationX(800);
      }
      else {
        this.player.setAccelerationY(0);
        this.player.setAccelerationX(0);
      }
      this.checkTurnKeys()
    }
  }