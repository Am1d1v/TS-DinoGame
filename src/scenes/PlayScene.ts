import Phaser, { Physics } from "phaser";
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

    // Obstacles spawn interval`
    spawnInterval: number = 1500;

    // Accumulation. If it's value > spawnInterval => spawn new obstacle
    spawnTime: number = 0;

    // Group of obstacles
    obstacles: Phaser.Physics.Arcade.Group;

    // Movement speed of obstacles
    obstacleSpeed: number = 5;

    // Ground move speed
    gameSpeed: number = 1;

    gameOverText: Phaser.GameObjects.Image;
    restartGame: Phaser.GameObjects.Image;
    gameOverContainer: Phaser.GameObjects.Container;


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
        this.createObstacles();
        this.createGameOverContainer();
        this.handeGameStart();
        this.handleObstacleCollision();
        this.handleGameRestart();   
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

        // Make obstacles move to the player's direction
        Phaser.Actions.IncX(this.obstacles.getChildren(), -this.obstacleSpeed) ;

        // Remove obstacle if its beyond left scene border
        this.obstacles.getChildren().forEach((obstacle: SpriteWithDynamicBody)  => {
            if(obstacle.getBounds().right < 0){
                this.obstacles.remove(obstacle);
            }

        });

        // Moving the ground in +X direction
        if(this.isGameRunning) this.ground.tilePositionX += this.gameSpeed;
    
    }

    // Draw scene environment
    createSceneEnvironment(){
        // Draw ground
        this.ground = this.add.tileSprite(0, this.gameHeight, 90, 26, 'ground').setOrigin(0, 1);
    }

    createObstacles(){
        // Array of obstacles
        this.obstacles = this.physics.add.group();
    }
    
    createGameOverContainer(){
        this.gameOverText = this.add.image(0, 0, "gameOverText");
        this.restartGame = this.add.image(0, 90, "restart");

        // Container for gameover text & restart game button
        this.gameOverContainer = this.add.container(this.gameWidth * 0.5, (this.gameHeight * 0.5 - 60))
            .add([this.gameOverText, this.restartGame])
            // Hide container
            .setAlpha(0);
    }

    handeGameStart(){
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

    handleObstacleCollision(){
        // Collide with obstacles
        this.physics.add.collider(this.obstacles, this.player, () => {
            this.isGameRunning = false;
            this.physics.pause();
            this.obstacleSpeed = 0;
            this.spawnTime = 0;
            this.player.die();

            // Show game over container
            this.gameOverContainer.setAlpha(1);
        });
    }

    handleGameRestart(){
         // Restart the game
         this.restartGame
            .setInteractive()
            .on('pointerdown', () => {
                this.physics.resume();
                this.player.setVelocityY(0);
                // Clear obstacles array
                this.obstacles.clear(true, true);
                // Hide Game Over Container
                this.gameOverContainer.setAlpha(0);
                
                this.anims.resumeAll();
                this.isGameRunning = true;
                this.obstacleSpeed = 5;
         });

    }

    // Render player 
    createPlayer(){
        this.player = new Player(this, 0, this.gameHeight, 'player').setOrigin(0, 1);
    }

    // Spawn Obstacles
    spawnObstacle(){
        const randomObstacleNumber = Math.floor(Math.random() * 7) + 1;
        const distance = Phaser.Math.Between(800, this.gameWidth);

        this.obstacles.create(distance, this.gameHeight, `${randomObstacleNumber <= 6 ? `obstacle${randomObstacleNumber}` : 'bird'}`)
            .setOrigin(0, 1)
            .setImmovable()
        //this.add.image(this.gameWidth * 0.5, this.gameHeight * 0.1, `obstacle${randomObstacleNumber}`).setOrigin(0, 1);
    }

    

};

export default PlayScene;