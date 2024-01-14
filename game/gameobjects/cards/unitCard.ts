import { Card } from "./card";
import UnitCardData from "@/game/data/cards/unitCardData";
import { EventEmitter } from "@/game/scripts/events";
import { EVENTS } from "@/game/enums/keys/events";
import { Position } from "@/game/data/types/position";
import UnitCardGO from "./unitCardGO";

export default class UnitCard extends Card<UnitCardData>{
    constructor(id:string,data:UnitCardData){
        super(id,data);
    }
    
    play(target:Position){
        EventEmitter.emit(EVENTS.fieldEvent.SUMMON_UNIT,target,this.data,this.owner);
    }

    render(scene : Phaser.Scene) : UnitCardGO{
        if (!this.gameObject) 
            this.gameObject=new UnitCardGO(scene,this);

        return this.gameObject;
    }

}