import { CANVAS_SIZE } from "@/game/config";
import { Position } from "@/game/data/types/position";
import { EVENTS } from "@/game/enums/keys/events";
import { UI_COLORS } from "@/game/enums/keys/uiColors";
import { EventEmitter } from "@/game/scripts/events";


const RESOURCE_DISPLAY_SIZE = {
    width:  CANVAS_SIZE.width*0.12,
    height: CANVAS_SIZE.height*0.4,
}

export default class ResourceDisplay extends Phaser.GameObjects.Container{
    private bg: Phaser.GameObjects.Rectangle;

    constructor(        
        scene:Phaser.Scene, 
        position: Position){
        super(scene,position.x,position.y);
        this.bg = scene.add.rectangle(
            0,
            0,
            RESOURCE_DISPLAY_SIZE.width,
            RESOURCE_DISPLAY_SIZE.height,
            UI_COLORS.background
        ).setOrigin(0);
        
        const currResourceText = scene.add.text(
            RESOURCE_DISPLAY_SIZE.width*0.2,
            RESOURCE_DISPLAY_SIZE.height*0.2,
            "0",
            {
                fontSize:50
            }
        )

        const line = scene.add.line(
            0,
            RESOURCE_DISPLAY_SIZE.height*0.25,
            RESOURCE_DISPLAY_SIZE.height*0.1,
            RESOURCE_DISPLAY_SIZE.height*0.4,
            RESOURCE_DISPLAY_SIZE.width*0.8,
            -RESOURCE_DISPLAY_SIZE.height*0.05,
            0xFFFFFF
        )
        .setLineWidth(3)
        .setOrigin(0);

        const maxResourceText = scene.add.text(
            RESOURCE_DISPLAY_SIZE.width*0.55,
            RESOURCE_DISPLAY_SIZE.height*0.5,
            "0",
            {
                fontSize:50
            }
        )
        this.add(this.bg);
        this.add(currResourceText);
        this.add(line);
        this.add(maxResourceText);
        
        EventEmitter.on(
            EVENTS.uiEvent.UPDATE_RESOURCE_DISPLAY,
            (currResource:number, maxResource:number)=>{
                console.log(`Update Display with ${currResource}/ ${maxResource}`);
                currResourceText.setText(String(currResource));
                maxResourceText.setText(String(maxResource));
            }
        )
    }
}