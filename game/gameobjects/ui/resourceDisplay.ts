import { CANVAS_SIZE } from "@/game/config";
import { Position } from "@/game/data/position";
import { GAME_STATE } from "@/game/enums/keys/gameState";
import { UI_COLORS } from "@/game/enums/keys/uiColors";

const RESOURCE_DISPLAY_SIZE = {
    width:  CANVAS_SIZE.width*0.15,
    height: CANVAS_SIZE.height*0.4,
}

export default class ResourceDisplay extends Phaser.GameObjects.Container{
    bg: Phaser.GameObjects.Rectangle;
    name:string;

    constructor(        
        scene:Phaser.Scene, 
        name: string, 
        position: Position){
        super(scene,position.x,position.y);
        this.name=name;
        this.bg = scene.add.rectangle(
            0,
            0,
            RESOURCE_DISPLAY_SIZE.width,
            RESOURCE_DISPLAY_SIZE.height,
            UI_COLORS.background
        ).setOrigin(0);

        

        const player = scene.game.registry.get(GAME_STATE.player);
        console.log(JSON.stringify(player));
        const {current,max,perTurn}=player.getResources();
        
        const currResourceText = scene.add.text(
            RESOURCE_DISPLAY_SIZE.width*0.2,
            RESOURCE_DISPLAY_SIZE.height*0.2,
            String(current),
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
            RESOURCE_DISPLAY_SIZE.width*0.65,
            RESOURCE_DISPLAY_SIZE.height*0.5,
            String(max),
            {
                fontSize:50
            }
        )
        this.add(this.bg);
        this.add(currResourceText);
        this.add(line);
        this.add(maxResourceText);
        
    }



    update(){
        
    }

}