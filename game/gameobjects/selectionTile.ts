import { Position } from "../data/position";
import { EVENTS } from "../enums/keys/events";
import { getColorByStatus } from "../enums/keys/tileColors";
import { TileSelectionType } from "../enums/tileSelectionType";
import { TileStatus} from "../enums/tileStatus";
import { EventEmitter } from "../scripts/events";
import Unit from "./unit";

export default class SelectionTile {
    private tile: Phaser.GameObjects.Rectangle;
    private status:TileStatus; 
    private readonly initStatus:TileStatus;
    readonly tilePosition: Position;
    private tileSelectionType: TileSelectionType;
    private selectedUnit?:Unit;

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
        this.tileSelectionType=TileSelectionType.NONE;
        this.selectedUnit=undefined;

        this.tile.on(
            Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
            ()=>{
                switch(this.status){
                    case TileStatus.SUCCESS:
                        switch(this.tileSelectionType){
                            case TileSelectionType.PLAY_CARD:
                                EventEmitter.emit(EVENTS.cardEvent.PLAY,{x:tilePosition.x,y:tilePosition.y});
                                break;
                            case TileSelectionType.MOVE_UNIT:
                                EventEmitter.emit(EVENTS.unitEvent.MOVE,this.selectedUnit,this.tilePosition);
                                break;
                            default:
                                break;
                        }
                        
                        break;
                    default:
                        console.log("Not a valid target");
                        break;
                }
                
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

    show(status?:TileStatus,unit?:Unit, tileSelectionType: TileSelectionType = TileSelectionType.NONE){
        this.tileSelectionType=tileSelectionType;
        this.setStatus(status? status: this.initStatus);
        this.selectedUnit=unit? unit: undefined;
        this.tile.setVisible(true);
    }

    hide(){
        this.status=this.initStatus;
        this.tile.setVisible(false);
        this.selectedUnit=undefined;
    }
}