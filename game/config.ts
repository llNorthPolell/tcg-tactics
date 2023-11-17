import Phaser from "phaser";


export const CANVAS_SIZE = {
    width:"90%",
    height:"90%",
}

export const config : Phaser.Types.Core.GameConfig= {
    type: Phaser.AUTO,
    scale: {
        width:CANVAS_SIZE.width,
        height:CANVAS_SIZE.height,
    },
    parent: "game",
    backgroundColor: 0x000000,
    physics: {
        default: 'arcade',
        arcade:{
            //debug: true
        }
    },
}