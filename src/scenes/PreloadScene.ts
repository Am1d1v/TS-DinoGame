import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {
    constructor(){
        super("PreloadScene");
    };

    preload () {
        // Load Sky Immage
        this.load.image('ground', 'assets/ground.png');
    }

};

export default PreloadScene;