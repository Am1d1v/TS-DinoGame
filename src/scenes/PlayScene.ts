import Phaser from "phaser";


class PlayScene extends Phaser.Scene {
    constructor(){
        super("PlayScene");

        
    };

    // Get game height
    get gameHeight(){
        return this.game.config.height as number;
    }

    create(){

        // Draw ground
        this.add.tileSprite(0, this.gameHeight, 1000, 26, 'ground').setOrigin(0, 1);
    }

};

export default PlayScene;