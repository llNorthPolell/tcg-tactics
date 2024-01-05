import HeroCardData from "../../data/cards/heroCardData";
import { Card } from "./card";
import { EventEmitter } from "@/game/scripts/events";
import { EVENTS } from "@/game/enums/keys/events";
import { Position } from "@/game/data/position";
import Player from "@/game/data/player";

export default class HeroCard extends Card<HeroCardData>{
    constructor(id:string,data:HeroCardData,owner:Player){
        super(id,data,owner);
    }
    
    play(target:Position){
        EventEmitter.emit(EVENTS.fieldEvent.SUMMON_UNIT,target,this.data,this.owner);
    }

    render(scene:Phaser.Scene){
        return this.renderGameObject(scene,0x770000,"heroes");
    }
}
