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

    // Check the game is running
    isGameRunning: boolean = false;

    // Obstacles spawn interval
    spawnInterval: number = 1500;

    // Accumulation. If it's value > spawnInterval => spawn new obstacle
    spawnTime: number = 0;

    // Group of obstacles
    obstacles: Phaser.Physics.Arcade.Group;

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

        this.obstacles = this.physics.add.group();

        // Trigger that starts the game. Invisible object that launch game.
        this.startGameTrigger = this.physics.add.sprite(0, 30, null).setAlpha(0).setOrigin(0, 1);

        // Move trigger to the ground after first touch
        this.physics.add.overlap(this.startGameTrigger, this.player, () => {
            if(this.startGameTrigger.y === 30){
                this.startGameTrigger.body.reset(0, this.gameHeight);
                this.isGameRunning = true;
                return;
            }

            // Hide start game trigger from the scene
            this.startGameTrigger.body.reset(-100, -100);
            
            //this.startGroundRoll = true;

            const groundRollOutEvent = this.time.addEvent({
                delay: 1000 / 16,
                loop: true,
                callback: () => {
                        // Roll out the ground
                        this.ground.width += 45;

                        // Game is running
                        this.isGameRunning = true;

                        // Play run aniamtion
                        this.player.playRunAnimation();

                        // Push player to the front(X axis direction)
                        this.player.setVelocityX(150);

                        if(this.ground.width >= this.gameWidth){
                            groundRollOutEvent.remove();
                            this.player.setVelocityX(0);
                        }
                }
            });


            
        });
    }

    // Update scene state
    update(time: number, delta: number): void {

        if(this.isGameRunning){
            this.spawnTime += delta;

            if(this.spawnTime > this.spawnInterval){
                this.spawnObstacle();
                this.spawnTime = 0;
            }
        }

        Phaser.Actions.IncX(this.obstacles.getChildren(), -5) ;
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

    // Spawn Obstacles
    spawnObstacle(){
        const randomObstacleNumber = Math.floor(Math.random() * 6) + 1;
        const distance = Phaser.Math.Between(600, 900);

        this.obstacles.create(distance, this.gameHeight, `obstacle${randomObstacleNumber}`).setOrigin(0, 1);
        //this.add.image(this.gameWidth * 0.5, this.gameHeight * 0.1, `obstacle${randomObstacleNumber}`).setOrigin(0, 1);
    }

    

};

export default PlayScene;