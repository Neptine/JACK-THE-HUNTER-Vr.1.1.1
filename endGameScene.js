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
