import { Card } from "./card";
import UnitCardData from "@/game/data/cards/unitCardData";
import { EventEmitter } from "@/game/scripts/events";
import { EVENTS } from "@/game/enums/keys/events";
import { Position } from "@/game/data/position";
import Player from "@/game/data/player";

export default class UnitCard extends Card<UnitCardData>{

    constructor(id:string,data:UnitCardData,owner:Player){
        super(id,data,owner);
    }
    
    play(target:Position){
        EventEmitter.emit(EVENTS.fieldEvent.SUMMON_UNIT,target,this.data,this.owner);
    }

    render(scene:Phaser.Scene){
        return this.renderGameObject(scene,0x777700,"units");
    }
}