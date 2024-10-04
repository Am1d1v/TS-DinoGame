import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {
    constructor(){
        super("PreloadScene");
    };

    preload () {
        // Load Sky Immage
        this.load.image('ground', 'assets/ground.png');

        // Load Player(Dinosaur) Image
        this.load.image('player', 'assets/dino-idle-2.png');

        // Load Player Run Animation
        this.load.spritesheet('playerRunAnimation', 'assets/dino-run.png', {
            frameWidth: 88,
            frameHeight: 94
        });

        // Load Obstacles Images
        this.load.image('obstacle1', 'assets/cactuses_1.png');
        this.load.image('obstacle2', 'assets/cactuses_2.png');
        this.load.image('obstacle3', 'assets/cactuses_3.png');
        this.load.image('obstacle4', 'assets/cactuses_4.png');
        this.load.image('obstacle5', 'assets/cactuses_5.png');
        this.load.image('obstacle6', 'assets/cactuses_6.png');
    }

    create(){
        // Launch PlayScene
        this.scene.start('PlayScene');
    }

};

export default PreloadScene;