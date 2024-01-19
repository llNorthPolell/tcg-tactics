import { TILESIZE } from "../config";
import { Position } from "../data/types/position";
import { AMITY_COLORS } from "../enums/keys/amityColors";
import { EVENTS } from "../enums/keys/events";
import { TileSelectionType } from "../enums/tileSelectionType";
import { TileStatus} from "../enums/tileStatus";
import { EventEmitter } from "../scripts/events";


export default class SelectionTile {
    private tile: Phaser.GameObjects.Rectangle;
    private status:TileStatus; 
    private readonly initStatus:TileStatus;
    readonly position: Position;
    private tileSelectionType: TileSelectionType;
    private readonly alpha = 0.25;

    constructor(
        scene: Phaser.Scene,
        name:string, 
        position:Position,
        status=TileStatus.SUCCESS){
        const color = this.getColorByTileStatus(status);
        this.status=status;
        this.initStatus=status;
        this.position=position;
        const pixelPosition = {x: position.x * TILESIZE.width, y: position.y * TILESIZE.height}
        this.tile=scene.add.rectangle(pixelPosition.x, pixelPosition.y,TILESIZE.width, TILESIZE.height,color,this.alpha)
            .setOrigin(0)
            .setStrokeStyle(1,color)
            .setName(name)
            .setInteractive();
        this.tileSelectionType=TileSelectionType.NONE;

        this.tile.on(
            Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
            ()=>{
                EventEmitter.emit(
                    (this.tileSelectionType===TileSelectionType.PLAY_CARD)? 
                        EVENTS.cardEvent.PLAY:EVENTS.unitEvent.MOVE,position);
            }
        )

        this.tile.setVisible(false);
    }


    setStatus(status:TileStatus){
        const color = this.getColorByTileStatus(status);
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

    show(tileSelectionType: TileSelectionType = TileSelectionType.NONE,status?:TileStatus){
        this.tileSelectionType=tileSelectionType;
        this.setStatus((status === undefined)? this.initStatus: status);
        this.tile.setVisible(true);
        console.log(`${this.tile.visible}`);
    }

    hide(){
        this.status=this.initStatus;
        this.tile.setVisible(false);
    }

    private getColorByTileStatus(status:TileStatus){
        switch (status){
            case TileStatus.SUCCESS:
                return AMITY_COLORS.success;
            case TileStatus.WARNING:
                return AMITY_COLORS.warning;
            case TileStatus.DANGER:
                return AMITY_COLORS.danger;
            default:
                return AMITY_COLORS.none;
        }
    }
}