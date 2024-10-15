import Phaser from "phaser";
import { PRELOAD_CONFIGURATION } from "..";


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
        for(let i = 1; i <= PRELOAD_CONFIGURATION.cactusesCount; i++){
            this.load.image(`obstacle${i}`, `assets/cactuses_${i}.png`);
        };

        // Load player's loose Image
        this.load.image('loose', 'assets/dino-hurt.png');

        // Load Restart Game Button
        this.load.image('restart', 'assets/restart.png');

        // Load "Game Over" text png
        this.load.image('gameOverText', 'assets/game-over.png');

        // Load player's crouch image
        this.load.spritesheet('crouch', 'assets/dino-down-2.png', {
            frameWidth: 118,
            frameHeight: 94
        });

        // Load enemy bird type image
        this.load.spritesheet('bird', 'assets/enemy-bird.png', {
            frameWidth: 92,
            frameHeight: 77
        });

        // Load cloud image
        this.load.image('cloud', 'assets/cloud.png');

        // Load jump sound
        this.load.audio('jump', 'assets/jump.m4a');
    }

    create(){
        // Launch PlayScene
        this.scene.start('PlayScene');
    }

};

export default PreloadScene;