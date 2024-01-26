import { TileStatus, getColorByTileStatus } from "@/game/enums/tileStatus";
import SelectionTile from "./selectionTile";
import { EventEmitter } from "@/game/scripts/events";
import { TileSelectionType } from "@/game/enums/tileSelectionType";
import { EVENTS } from "@/game/enums/keys/events";

export default class SelectionTileController{
    readonly id:string;

    private readonly tile:SelectionTile;

    private tileSelectionType:TileSelectionType;
    
    private initStatus:TileStatus;

    constructor(tile:SelectionTile,initStatus:TileStatus){
        this.id=`${tile.position.x}_${tile.position.y}`;
        this.tile=tile;
        this.tileSelectionType=TileSelectionType.NONE;
        this.initStatus=initStatus;
        this.tile.setInteractive()
            .on(
                Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
                ()=>{
                    this.handleClick();
                }
            )
        
    }

    show(status:TileStatus=this.initStatus){
        const color = getColorByTileStatus(status);
        this.tile.setColor(color);
        this.tile.show();
        if (status!==TileStatus.SUCCESS)
            this.tile.disable();
        else
            this.tile.setInteractive();
    }

    hide(){
        this.tile.hide();
        this.reset();
    }

    reset(){
        const color = getColorByTileStatus(this.initStatus);
        this.tile.setColor(color);
        this.tileSelectionType=TileSelectionType.NONE;
    }

    handleClick(){
        if (this.tileSelectionType === TileSelectionType.NONE) return;
        EventEmitter.emit(
            (this.tileSelectionType===TileSelectionType.PLAY_CARD)? 
                EVENTS.cardEvent.PLAY:EVENTS.unitEvent.MOVE,this.tile.position);
    }

    setSelectionType(tileSelectionType:TileSelectionType){
        this.tileSelectionType=tileSelectionType;
    }
}