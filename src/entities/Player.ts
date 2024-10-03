

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

        this.registerPlayerAnimation();
    }

    update(): void {
        // Get space bar
        const {space} = this.cursors; 
        // Make space bar interactive once per push. Block holding space bar spam
        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);

        // Check that the player is on the floor(ground)
        const onFloor = (this.body as Phaser.Physics.Arcade.Body).onFloor();
        
        // Jump(Change Y velocity) using space bar 
        if(isSpaceJustDown && onFloor){
            this.setVelocityY(-1000);
        }

        // Stop running animation while player is not on the floor
        if(!onFloor){
            this.anims.stop();
        } else {
            this.play('player-run', true);
        }

        // Prevent running on the same place on the start of the game
        if(this.body.x < 22){
            this.anims.stop();
        }
    }

    // Play run animation
    playRunAnimation(){
        this.play('player-run', true);
    }

    // Register player animation
    registerPlayerAnimation(){
        this.anims.create({
            key: 'player-run',
            frames: this.anims.generateFrameNumbers('playerRunAnimation', {
                start: 2,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });
    }

}
export default Player;