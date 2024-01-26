import { HAND_UI_SIZE, HUD_BUTTON_SIZE } from "@/game/config";
import Button from "./button";
import { UI_COLORS } from "@/game/enums/keys/uiColors";
import { EventEmitter } from "@/game/scripts/events";
import { EVENTS } from "@/game/enums/keys/events";

export default class UnitControlsPanel extends Phaser.GameObjects.Container{
    private readonly waitButton:Button;
    private readonly cancelButton:Button;

    constructor(scene:Phaser.Scene){
        super(scene,HAND_UI_SIZE.width * 0.8,HAND_UI_SIZE.height*0.1)

        this.cancelButton = new Button(
            scene,
            "cancelUnitButton",
            "Cancel",
            {x:0,y:HAND_UI_SIZE.height*0.5},
            HUD_BUTTON_SIZE.width,
            HUD_BUTTON_SIZE.height,
            UI_COLORS.cancel,
            ()=>{this.cancelButton?.bg.setFillStyle(UI_COLORS.cancelLight)},
            ()=>{
                this.cancelButton?.bg.setFillStyle(UI_COLORS.cancel);
                EventEmitter.emit(EVENTS.unitEvent.CANCEL);
            });
            this.add(this.cancelButton);

            this.waitButton = new Button(
            scene,
            "waitButton",
            "Wait",
            {x:0,y:0},
            HUD_BUTTON_SIZE.width,
            HUD_BUTTON_SIZE.height,
            UI_COLORS.action,
            ()=>{this.waitButton?.bg.setFillStyle(UI_COLORS.actionLight)},
            ()=>{
                this.waitButton?.bg.setFillStyle(UI_COLORS.action);
                EventEmitter.emit(EVENTS.unitEvent.WAIT);
            });

        this.add(this.waitButton);
        this.waitButton.hide();
        this.hide();
    }

    show(){
        this.setVisible(true);
    }

    hide(){
        this.setVisible(false);
    }

    showWaitButton(){
        this.waitButton.show();
    }

    hideWaitButton(){
        this.waitButton.hide();
    }
}