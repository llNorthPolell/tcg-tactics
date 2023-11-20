import Phaser from "phaser";

export const SCALE = 3.125;

export const TILESIZE = {
    width:100,
    height:100
}

export const CANVAS_SIZE = {
    width:1280,
    height:720,
}

export const HAND_UI_SIZE = {
    width:CANVAS_SIZE.width,
    height: CANVAS_SIZE.height*0.2
}

export const CARD_SIZE = {
    width:HAND_UI_SIZE.width*0.025*SCALE,
    height: HAND_UI_SIZE.height
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