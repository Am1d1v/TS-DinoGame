import Phaser from "phaser";


class PlayScene extends Phaser.Scene {
    constructor(){
        super("PlayScene");
    };

    create(){
        // Draw ground
        this.add.tileSprite(0, 330, 1000, 26, 'ground').setOrigin(0, 1);
    }

};

export default PlayScene;