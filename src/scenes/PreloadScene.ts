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
    }

    create(){
        // Launch PlayScene
        this.scene.start('PlayScene');
    }

};

export default PreloadScene;