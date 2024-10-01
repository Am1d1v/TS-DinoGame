

class Player extends Phaser.Physics.Arcade.Sprite {

    cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor(scene: Phaser.Scene, x: number, y: number, key: string){
        super(scene, x, y, key);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.init();
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    // Player initialization
    init(){
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        
        this.setOrigin(0, 1)
            // Set gravity to player
            .setGravityY(1500)
            // Set world boundaries
            .setCollideWorldBounds(true)
            // Set Player's body size
            .setBodySize(45, this.height - 10);

        //this.registerPlayerControl();    
        
    }

    // Register player inputs
    // registerPlayerControl(){
    //     // Jump Up using space bar
    //     const spaceBar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    //     spaceBar.on('down', () => {
    //         this.setVelocityY(-1000);
    //     });
    // }

    update(): void {
        // Get space bar
        const {space} = this.cursors; 

        // Jump(Change Y velocity) using space bar 
        if(space.isDown){
            this.setVelocityY(-1000);
        }
    }

}
export default Player;