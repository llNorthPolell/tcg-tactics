import { CANVAS_SIZE } from "@/game/config";
import { Position } from "@/game/data/types/position";
import { ASSETS } from "@/game/enums/keys/assets";
import { EVENTS } from "@/game/enums/keys/events";
import { UI_COLORS } from "@/game/enums/keys/uiColors";
import { EventEmitter } from "@/game/scripts/events";

const DECK_STAT_DISPLAY_SIZE = {
    width:  CANVAS_SIZE.width*0.12,
    height: CANVAS_SIZE.height*0.2,
}

export default class DeckStatDisplay extends Phaser.GameObjects.Container{
    private bg: Phaser.GameObjects.Rectangle;

    constructor(        
        scene:Phaser.Scene, 
        position: Position){
        super(scene,position.x,position.y);
        this.bg = scene.add.rectangle(
            0,
            0,
            DECK_STAT_DISPLAY_SIZE.width,
            DECK_STAT_DISPLAY_SIZE.height,
            UI_COLORS.background
        ).setOrigin(0);
        
        const deckCountIcon = scene.add.image(
            DECK_STAT_DISPLAY_SIZE.width*0.2,
            DECK_STAT_DISPLAY_SIZE.height*0.3,
            ASSETS.DECK_COUNT
        ).setOrigin(0.5);

        const deckCountText = scene.add.text(
            DECK_STAT_DISPLAY_SIZE.width*0.4,
            DECK_STAT_DISPLAY_SIZE.height*0.15,
            "X 0",
            {
                fontSize:50
            }
        );

        const deathCountIcon = scene.add.image(
            DECK_STAT_DISPLAY_SIZE.width*0.2,
            DECK_STAT_DISPLAY_SIZE.height*0.7,
            ASSETS.DEATH_COUNT
        ).setOrigin(0.5);

        const deathCountText = scene.add.text(
            DECK_STAT_DISPLAY_SIZE.width*0.4,
            DECK_STAT_DISPLAY_SIZE.height*0.55,
            "X 0",
            {
                fontSize:50
            }
        );

        this.add(this.bg);
        this.add(deckCountIcon);
        this.add(deckCountText);
        this.add(deathCountIcon);
        this.add(deathCountText);
        
        EventEmitter
        .on(
            EVENTS.uiEvent.UPDATE_DECK_COUNTER,
            (count:number)=>{
                deckCountText.setText(`X ${count}`);
            }
        )
        .on(
            EVENTS.uiEvent.UPDATE_CASUALTY_COUNTER,
            (count:number)=>{
                deathCountText.setText(`X ${count}`);
            }
        )
    }
}