class EndGameScene extends Phaser.Scene {
  constructor() {
    super('EndGameScene')
  }
  preload() {
    this.load.image('winGame', 'winGame.png')
    this.load.image('loseGame', 'loseGame.png')
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
