import Phaser, { Physics } from "phaser";
import { SpriteWithDynamicBody } from "../types";
import Player from "../entities/Player";
import { PRELOAD_CONFIGURATION } from "..";


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

    // Game speed modifier. Increase depends on current score
    gameSpeedModifier: number = 1; 

    // Game score text
    scoreText: Phaser.GameObjects.Text;

    score: number = 0;

    // How often score increment
    scoreInterval: number = 100;

    scoreDeltaTime: number = 0;

    gameOverText: Phaser.GameObjects.Image;
    restartGame: Phaser.GameObjects.Image;
    gameOverContainer: Phaser.GameObjects.Container;
    clouds: Phaser.GameObjects.Group;

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
        this.createAnimations();
        this.createScore();
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

        // Score Increment
        this.scoreDeltaTime += delta;

        if(this.scoreDeltaTime >= this.scoreInterval && this.isGameRunning){
            this.score++;
            this.scoreDeltaTime = 0;

            // Increase game speed modifier per 100 score points
            if(this.score % 100 === 0 && this.score !== 0) this.gameSpeedModifier += 0.05;
            console.log(this.gameSpeedModifier)
        }

        

        // Make obstacles move to the player's direction
        Phaser.Actions.IncX(this.obstacles.getChildren(), -this.obstacleSpeed * this.gameSpeedModifier);

        // Make clouds move to the left side
        Phaser.Actions.IncX(this.clouds.getChildren(), -1);

        const score = Array.from(String(this.score), Number);

        for (let i = 0; i < 5 - String(this.score).length; i++) {
            score.unshift(0);
        };

        this.scoreText.setText(score.join(''));

        // Remove obstacle if its beyond left scene border
        this.obstacles.getChildren().forEach((obstacle: SpriteWithDynamicBody)  => {
            if(obstacle.getBounds().right < 0){
                this.obstacles.remove(obstacle);
            }
        });

        this.clouds.getChildren().forEach((cloud: SpriteWithDynamicBody) => {
            if(cloud.getBounds().right < 0){
                cloud.x = this.gameWidth + 300;
            }
        });

        // Moving the ground in +X direction
        if(this.isGameRunning) this.ground.tilePositionX += (this.gameSpeed * this.gameSpeedModifier);
    
    }

    // Draw scene environment
    createSceneEnvironment(){
        // Draw ground
        this.ground = this.add.tileSprite(0, this.gameHeight, 90, 26, 'ground').setOrigin(0, 1);

        // Create clouds group
        this.clouds = this.add.group();
        // Draw clouds
        this.clouds = this.clouds.addMultiple([
            this.add.image(this.gameWidth * 0.6, 200, 'cloud'),
            this.add.image(this.gameWidth -80, 90, 'cloud'),
            this.add.image(this.gameWidth * 0.3, 100, 'cloud'),
        ]);

        // Hide clouds at the start of the game
        this.clouds.setAlpha(0);
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
            
            // Show game score
            this.scoreText.setAlpha(1);

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

                        // Display clouds
                        this.clouds.setAlpha(1);

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
            this.scoreDeltaTime = 0;
            this.score = 0;

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

                // Return games speed modifier to defaul value
                this.gameSpeedModifier = 1;
         });

    }

    // Render player 
    createPlayer(){
        this.player = new Player(this, 0, this.gameHeight, 'player').setOrigin(0, 1);
    }

    // Bird enemy animation
    createAnimations(){
        this.anims.create({
            key: 'enemy-bird-fly',
            frames: this.anims.generateFrameNumbers("bird"),
            frameRate: 6,
            repeat: -1
        })
    };

    // Game Score Text
    createScore(){
        this.scoreText = this.add.text(this.gameWidth - 120, 50, "000000", {
            fontSize: 30,
            fontFamily: "Arial",
            color: "#333", 
            resolution: 3
        } ).setOrigin(0, 1)
           .setAlpha(0);
    };

    // Spawn Obstacles
    spawnObstacle(){
        const randomObstacleNumber = Math.floor(Math.random() * PRELOAD_CONFIGURATION.cactusesCount + PRELOAD_CONFIGURATION.birdsCount) + 1;
        const distance = Phaser.Math.Between(800, this.gameWidth);
        let obstacle;
        
        // Spawn obstacle cactus type
        if (randomObstacleNumber <= 6){
            obstacle = this.obstacles.create(distance, this.gameHeight, `obstacle${randomObstacleNumber}`)
            
        } else {
            // Spawn obstacle bird type 
            // How hight (Y axis) enemy bird will spawn
            const enemyPossibleHeight = [20, 70];
            const enemyHeight = Math.random() * 100 > 50 ? enemyPossibleHeight[0] : enemyPossibleHeight[1]

            obstacle = this.obstacles.create(distance, this.gameHeight - enemyHeight, 'bird');
            obstacle.play('enemy-bird-fly', true);
        }

        obstacle.setOrigin(0, 1).setImmovable()
        
    }

    

};

export default PlayScene;