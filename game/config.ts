import Phaser from "phaser";

export const TILESIZE = {
    width:32,
    height:32
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
    width:HAND_UI_SIZE.width*0.08,
    height: HAND_UI_SIZE.height
}

export const PORTRAIT_SIZE = {
    width: HAND_UI_SIZE.height,
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