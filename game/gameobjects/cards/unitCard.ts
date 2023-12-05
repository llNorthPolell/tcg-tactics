import { Card } from "./card";
import Unit from "../unit";
import UnitCardData from "@/game/data/cards/unitCardData";
import { EventEmitter } from "@/game/scripts/events";
import { EVENTS } from "@/game/enums/keys/events";
import { randomUUID } from "crypto";

export default class UnitCard extends Card<UnitCardData>{

    constructor(id:string,data:UnitCardData){
        super(id,data);
    }
    
    play(){
        const unit = new Unit(randomUUID().toString(),this.data);

        EventEmitter.emit(EVENTS.fieldEvent.SUMMON_UNIT,unit);
    }

    render(scene:Phaser.Scene){
        return this.renderGameObject(scene,0x777700);
    }
}