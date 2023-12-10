import { Position } from "../data/position";
import { EVENTS } from "../enums/keys/events";
import { getColorByStatus } from "../enums/keys/tileColors";
import { TileStatus} from "../enums/tileStatus";
import { EventEmitter } from "../scripts/events";
import Unit from "./unit";

export default class SelectionTile {
    private tile: Phaser.GameObjects.Rectangle;
    private status:TileStatus; 
    private readonly initStatus:TileStatus;
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
        this.initStatus=status;
        this.tilePosition=tilePosition;
        this.tile=scene.add.rectangle(positionInPixels.x, positionInPixels.y,width, height,color,0.25)
            .setOrigin(0)
            .setStrokeStyle(1,color)
            .setName(name)
            .setInteractive();
        
        this.tile.on(
            Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
            ()=>{
                switch(this.status){
                    case TileStatus.SUCCESS:
                        EventEmitter.emit(EVENTS.cardEvent.PLAY,{x:tilePosition.x,y:tilePosition.y});
                        break;
                    default:
                        console.log("Not a valid target");
                        break;
                }
                
            }
        )

        EventEmitter.on(
            EVENTS.unitEvent.CHECK_STANDING_ON_RALLY,
            (unit:Unit)=>{
                const location = unit.getLocation();
                if (location.x == this.tilePosition.x && location.y == this.tilePosition.y)
                    this.setStatus(TileStatus.DANGER);
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

    show(status?:TileStatus){
        this.setStatus(status? status: this.initStatus);
        
        this.tile.setVisible(true);
    }

    hide(){
        this.status=this.initStatus;
        this.tile.setVisible(false);
    }
}