import { HAND_UI_SIZE, HUD_BUTTON_SIZE } from "@/game/config";
import Button from "./button";
import { UI_COLORS } from "@/game/enums/keys/uiColors";
import { EventEmitter } from "@/game/scripts/events";
import { EVENTS } from "@/game/enums/keys/events";

export default class EndTurnButton extends Button{

    constructor(scene:Phaser.Scene){
        super(
            scene,
            "endTurnButton",
            "End Turn",
            {x:HAND_UI_SIZE.width * 0.8,y:HAND_UI_SIZE.height*0.1},
            HUD_BUTTON_SIZE.width,
            HUD_BUTTON_SIZE.height,
            UI_COLORS.action,
            ()=>{this.bg.setFillStyle(UI_COLORS.actionLight)},
            ()=>{
                this.bg.setFillStyle(UI_COLORS.action);
                EventEmitter.emit(EVENTS.gameEvent.NEXT_TURN);
            });
    }
}