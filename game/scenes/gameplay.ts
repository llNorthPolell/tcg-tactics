
import { HAND_UI_SIZE } from "../config";
import { TilemapData } from "../data/types/tilemapData";
import { GAME_STATE } from "../enums/keys/gameState";
import { SCENES } from "../enums/keys/scenes";
import setupMouseInputs from "../scripts/inputHandler";
import { EventEmitter } from "../scripts/events";
import { EVENTS } from "../enums/keys/events";


export default class GameplayScene extends Phaser.Scene{

    constructor(){
        super({
            key: SCENES.GAMEPLAY
        });
    }

    preload(){}

    create(){
        const tilemapData : TilemapData = this.game.registry.get(GAME_STATE.tilemapData);
        
        const map = tilemapData.map;
        const camera = this.cameras.main;

        const bounds = {x:map.widthInPixels*1.3, y: (map.heightInPixels)+(HAND_UI_SIZE.height/3.125)}
        this.cameras.main
            .setBounds(0,0,bounds.x,bounds.y)
            .setZoom(3.125);
        
        setupMouseInputs(this.input,camera);  


        this.game.scene.start(SCENES.HUD);
        this.game.scene.start(SCENES.TURN_TRANSITION);

        EventEmitter.emit(EVENTS.gameEvent.START_GAME);
    }

    update(){}
}