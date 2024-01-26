import { TILESIZE } from "../../config";
import { Position } from "../../data/types/position";

export default class SelectionTile extends Phaser.GameObjects.Rectangle{    
    readonly position:Position;

    constructor(scene:Phaser.Scene,position:Position,initColor:number){
        super(scene,
            position.x * TILESIZE.width,
            position.y * TILESIZE.height,
            TILESIZE.width,
            TILESIZE.height,
            initColor,
            0.25);
        this.position=position;

        this.setOrigin(0)
        .setStrokeStyle(1,initColor)
        .setName(`${position.x}_${position.y}`);
        
        this.hide();
        this.scene.add.existing(this);
    }

    show(){
        this.setVisible(true);
    }

    hide(){
        this.setVisible(false);
    }

    setColor(color:number){
        super.setFillStyle(color,0.25);
        this.setStrokeStyle(1,color);
    }
    
    disable(){
        this.disableInteractive();
    }
}