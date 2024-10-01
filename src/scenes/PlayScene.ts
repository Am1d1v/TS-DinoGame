import Phaser from "phaser";
import { SpriteWithDynamicBody } from "../types";
import Player from "../entities/Player";


class PlayScene extends Phaser.Scene {
    constructor(){
        super("PlayScene");

        
    };

    // Player's Sprite
    player: SpriteWithDynamicBody

    // Trigger that starts the game
    startGameTrigger: SpriteWithDynamicBody;

    // Get game height
    get gameHeight(){
        return this.game.config.height as number;
    }

    create(){  
        this.createSceneEnvironment();
        this.createPlayer();
        this.startGameTrigger = this.physics.add.sprite(0, 30, null).setAlpha(0).setOrigin(0, 1);
        this.registerPlayerControl();

        this.physics.add.overlap(this.startGameTrigger, this.player, () => {
            console.log('Collision');
            this.startGameTrigger = this.physics.add.sprite(0, this.gameHeight, null).setAlpha(0).setOrigin(0, 1);
        });
    }

    // Draw scene environment
    createSceneEnvironment(){
        // Draw ground
        this.add.tileSprite(0, this.gameHeight, 1000, 26, 'ground').setOrigin(0, 1);
    }

    // 
    createPlayer(){
        this.player = this.physics.add.sprite(0, this.gameHeight, 'player').setOrigin(0, 1);

        // Set gravity to player
        this.player.setGravityY(30)
        // Set world boundaries
        .setCollideWorldBounds(true)
        // Set Player's body size
        .setBodySize(45, this.player.height - 10)
    }

    // Register player inputs
    registerPlayerControl(){
        // Jump Up using space bar
        const spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spaceBar.on('down', () => {
            this.player.body.setVelocityY(-200);
        });
    }

};

export default PlayScene;