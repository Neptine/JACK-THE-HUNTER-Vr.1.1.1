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