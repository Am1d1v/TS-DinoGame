import Phaser from "phaser";
import { SpriteWithDynamicBody } from "../types";
import Player from "../entities/Player";


class PlayScene extends Phaser.Scene {
    constructor(){
        super("PlayScene");

        
    };

    // Player's Sprite
    player: Player

    // Trigger that starts the game
    startGameTrigger: SpriteWithDynamicBody;

    // 
    ground: Phaser.GameObjects.TileSprite;

    // If true => start generate ground
    startGroundRoll: boolean = false;

    // Get game height
    get gameHeight(){
        return this.game.config.height as number;
    }

    // Get game width
    get gameWidth(){
        return this.game.config.width as number;
    }

    create(){  
        this.createSceneEnvironment();
        this.createPlayer();

        // Trigger that starts the game. Invisible object that launch game.
        this.startGameTrigger = this.physics.add.sprite(0, 30, null).setAlpha(0).setOrigin(0, 1);

        // Move trigger to the ground after first touch
        this.physics.add.overlap(this.startGameTrigger, this.player, () => {
            if(this.startGameTrigger.y === 30){
                this.startGameTrigger.body.reset(0, this.gameHeight);
                return
            }

            // Hide start game trigger from the scene
            this.startGameTrigger.body.reset(-100, -100);
            
            //this.startGroundRoll = true;

            const groundRollOutEvent = this.time.addEvent({
                delay: 1000 / 16,
                loop: true,
                callback: () => {
                        // Roll out the ground
                        this.ground.width += 30;

                        if(this.ground.width >= this.gameWidth){
                            groundRollOutEvent.remove();
                        }

                        // Push player to the front(X axis direction)
                        this.player.setVelocityX(90);
                }
            })
            
        });
    }

    // Draw scene environment
    createSceneEnvironment(){
        // Draw ground
        this.ground = this.add.tileSprite(0, this.gameHeight, 90, 26, 'ground').setOrigin(0, 1);
    }

    // Render player 
    createPlayer(){
        this.player = new Player(this, 0, this.gameHeight, 'player').setOrigin(0, 1);

        
    }

    // Update scene state
    update(): void {
        // If true => start generate ground
        //if(this.startGroundRoll) this.ground.width += 18;
        
    }


};

export default PlayScene;