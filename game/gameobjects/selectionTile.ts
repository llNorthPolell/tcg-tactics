import { Position } from "../data/position";
import { EVENTS } from "../enums/keys/events";
import { getColorByStatus } from "../enums/keys/tileColors";
import { TileStatus} from "../enums/tileStatus";
import { EventEmitter } from "../scripts/events";

export default class SelectionTile {
    private tile: Phaser.GameObjects.Rectangle;
    private status:TileStatus; 
    readonly tilePosition: Position;

    constructor(
        scene: Phaser.Scene,
        name:string, 
        positionInPixels:Position,
        tilePosition:Position,
        width:number, 
        height:number,
        status=TileStatus.SUCCESS){
        const color = getColorByStatus(status);
        this.status=status;
        this.tilePosition=tilePosition;
        this.tile=scene.add.rectangle(positionInPixels.x, positionInPixels.y,width, height,color,0.25)
            .setOrigin(0)
            .setStrokeStyle(1,color)
            .setName(name)
            .setInteractive();
        
        this.tile.on(
            Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
            ()=>{
                EventEmitter.emit(EVENTS.cardEvent.PLAY,{x:tilePosition.x,y:tilePosition.y});
            }
        )

        this.tile.setVisible(false);
    }


    setStatus(status:TileStatus){
        const color = getColorByStatus(status);
        this.status = status;
        this.tile.setFillStyle(color,0.25);
        this.tile.setStrokeStyle(1,color);
    }


    getStatus(){
        return this.status;
    }

    getTile(){
        return this.tile;
    }

    show(status:TileStatus){
        this.setStatus(status);
        this.tile.setVisible(true);
    }

    hide(){
        this.tile.setVisible(false);
    }
}