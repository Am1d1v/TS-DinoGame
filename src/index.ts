import Phaser from "phaser";
import PlayScene from "./scenes/PlayScene";
import PreloadScene from "./scenes/PreloadScene";

export const PRELOAD_CONFIGURATION = {
  cactusesCount: 6,
  birdsCount: 1
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1000,
  height: 330,
  pixelArt: true,
  transparent: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      // gravity: {
      //   y: 10
      // }
    }
  },
  scene: [PreloadScene, PlayScene]
};

new Phaser.Game(config);

