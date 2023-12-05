import HeroCardData from "../../data/cards/heroCardData";
import { Card } from "./card";
import Unit from "../unit";
import { EventEmitter } from "@/game/scripts/events";
import { EVENTS } from "@/game/enums/keys/events";
import { randomUUID } from "crypto";

export default class HeroCard extends Card<HeroCardData>{
    constructor(id:string,data:HeroCardData){
        super(id,data);
    }
    
    play(){
        const unit = new Unit(randomUUID().toString(),this.data);

        EventEmitter.emit(EVENTS.fieldEvent.SUMMON_UNIT,unit);
    }

    render(scene:Phaser.Scene){
        return this.renderGameObject(scene,0x770000);
    }
}
