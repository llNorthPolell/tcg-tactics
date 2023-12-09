import { Card } from "./card";
import UnitCardData from "@/game/data/cards/unitCardData";
import { EventEmitter } from "@/game/scripts/events";
import { EVENTS } from "@/game/enums/keys/events";
import { Position } from "@/game/data/position";
import GamePlayer from "../gamePlayer";

export default class UnitCard extends Card<UnitCardData>{

    constructor(id:string,data:UnitCardData,owner:GamePlayer){
        super(id,data,owner);
    }
    
    play(location:Position){
        EventEmitter.emit(EVENTS.fieldEvent.SUMMON_UNIT,location,this.data,this.owner);
    }

    render(scene:Phaser.Scene){
        return this.renderGameObject(scene,0x777700,"units");
    }
}