

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, key: string){
        super(scene, x, y, key);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.init();
    }

    // Player initialization
    init(){
        
        this.setOrigin(0, 1)
            // Set gravity to player
            .setGravityY(1500)
            // Set world boundaries
            .setCollideWorldBounds(true)
            // Set Player's body size
            .setBodySize(45, this.height - 10);

        this.registerPlayerControl();    
        
    }

    // Register player inputs
    registerPlayerControl(){
        // Jump Up using space bar
        const spaceBar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spaceBar.on('down', () => {
            this.setVelocityY(-1000);
        });
    }
}
export default Player;