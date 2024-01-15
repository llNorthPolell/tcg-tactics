import HeroCardData from "../../data/cards/heroCardData";
import { EventEmitter } from "@/game/scripts/events";
import { EVENTS } from "@/game/enums/keys/events";
import { Position } from "@/game/data/types/position";
import HeroCardGO from "./heroCardGO";
import { Card } from "./card";

export default class HeroCard extends Card<HeroCardData>{
    constructor(id:string,data:HeroCardData){
        super(id,data);
    }
    
    play(target:Position){
        EventEmitter.emit(EVENTS.fieldEvent.SUMMON_UNIT,target,this.data,this.owner);
    }

    render(scene : Phaser.Scene) : HeroCardGO{
        if (!this.gameObject) 
            this.gameObject=new HeroCardGO(scene,this);

        return this.gameObject;
    }

}
