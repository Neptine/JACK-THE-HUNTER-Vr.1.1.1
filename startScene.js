class StartScene extends Phaser.Scene {
    constructor() {
      super('StartScene')
    }
    preload() {
      this.load.image('start', 'startScreen.png')
    }
    create() {
      this.add.image(windowWidth / 2, windowHeight / 2, 'start')
      this.input.keyboard.on('keyup', (event) => {
        this.scene.start('GameScene')
      }, this)
    }
  }
