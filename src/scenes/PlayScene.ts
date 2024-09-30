import Phaser from "phaser";


class PlayScene extends Phaser.Scene {
    constructor(){
        super("PlayScene");

        
    };

    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody

    // Get game height
    get gameHeight(){
        return this.game.config.height as number;
    }

    create(){  
        this.createSceneEnvironment();
        this.createPlayer();
        this.registerPlayerControl();
    }

    // Draw scene environment
    createSceneEnvironment(){
        // Draw ground
        this.add.tileSprite(0, this.gameHeight, 1000, 26, 'ground').setOrigin(0, 1);
    }

    // 
    createPlayer(){
        this.player = this.physics.add.sprite(0, this.gameHeight, 'player').setOrigin(0, 1);
    }

    // Register player inputs
    registerPlayerControl(){
        // Jump Up
        const spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spaceBar.on('down', () => {
            this.player.body.setVelocityY(-110);
        });
    }

};

export default PlayScene;