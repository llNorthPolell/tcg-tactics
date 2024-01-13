import HeroCardData from "../../data/cards/heroCardData";
import { Card } from "./card";
import { EventEmitter } from "@/game/scripts/events";
import { EVENTS } from "@/game/enums/keys/events";
import { Position } from "@/game/data/types/position";
import Player from "@/game/data/player";
import HeroCardGO from "./heroCardGO";
import UnitCard from "./unitCard";

export default class HeroCard extends UnitCard{
    constructor(id:string,data:HeroCardData,owner:Player){
        super(id,data,owner);
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
